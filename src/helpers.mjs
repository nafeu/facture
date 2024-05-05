import {
  CURRENCY_DATA,
  DOCUMENT_TYPE_LABEL_MAPPING,
  RATE_INTERVAL_LABELS,
} from './constants.mjs'

let items = []

export const collectItem = (item) => {
  const newItem = { item, details: [] }
  items.push(newItem)
  return items
}

export const collectDetail = (detail) => {
  if (items.length > 0) {
    items[items.length - 1].details.push(detail)
  }
  return items
}

export const getRandomHexString = () => {
  const chars = '0123456789abcdef'
  let result = ''
  for (var i = 6; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))]
  return result.toUpperCase()
}

export const generateUniqueIdFromYYYYMMDD = (inputDateString) =>
  `${inputDateString.split('-').join('')}${getRandomHexString()}`

export const getDateLabelFromYYYYMMDD = (inputDateString) =>
  new Date(`${inputDateString}T00:00:00`).toDateString()

export const getCurrentDateInYYYYMMDD = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const collectMultipleStringArguments = (item, previousItems) =>
  previousItems.concat(item)

export const processOptions = (options) => {
  const delimiter = options.delimiter

  const documentTypeLabel = DOCUMENT_TYPE_LABEL_MAPPING[options.type]
  const documentId =
    options.documentId || generateUniqueIdFromYYYYMMDD(options.date)

  const currencySymbol = CURRENCY_DATA[options.currency.toUpperCase()].symbol
  const currencyCode = CURRENCY_DATA[options.currency.toUpperCase()].code

  const businessInfo = (() => {
    const [businessName, ...businessDetails] = options.business.split(delimiter)

    return {
      businessName,
      businessDetails,
    }
  })()

  const clientInfo = (() => {
    const [clientName, ...clientDetails] = options.client.split(delimiter)

    return {
      clientName,
      clientDetails,
    }
  })()

  const items = options.item.map(({ item, details }) => {
    const [service, unitsString, rateIntervalString, date] =
      item.split(delimiter)

    const units = Math.max(Number(unitsString || 0), 1)
    const isFlat = Number(unitsString || 0) < 1

    const hasDetails = details && details.length > 0

    const [rateString, interval] = rateIntervalString
      .split('/')
      .map((str) => str.trim())
    const rate = Number(rateString)
    const intervalLabel = interval ? ` / ${RATE_INTERVAL_LABELS[interval]}` : ''
    const amountLabel = `${currencySymbol}${rate.toFixed(2)}`
    const rateLabel = `${amountLabel}${intervalLabel}`
    const total = units * rate
    const totalLabel = `${currencySymbol}${total.toFixed(2)}`

    return {
      ...(date ? { date, dateLabel: getDateLabelFromYYYYMMDD(date) } : {}),
      service,
      units,
      ...(hasDetails ? { details } : {}),
      rate,
      rateLabel,
      total,
      totalLabel,
      ...(isFlat ? { isFlat } : {}),
    }
  })

  const subtotal = items.reduce((sum, { total }) => {
    sum += total
    return sum
  }, 0)
  const subtotalLabel = `${currencySymbol}${subtotal.toFixed(2)}`

  const taxRate = (() => {
    const [taxRateString] = options.taxInfo.split(delimiter)

    if (
      taxRateString === undefined ||
      taxRateString === null ||
      taxRateString === ''
    ) {
      return 0
    }

    if (taxRateString.includes('%')) {
      return Number(taxRateString.split('%')[0]) / 100
    }

    return Number(taxRateString)
  })()

  const taxRateLabel = (() => {
    const [taxRateString] = options.taxInfo.split(delimiter)

    if (
      taxRateString === undefined ||
      taxRateString === null ||
      taxRateString === ''
    ) {
      return '0%'
    }

    if (taxRateString.includes('%')) {
      return taxRateString
    }

    return `${taxRate * 100}%`
  })()

  // eslint-disable-next-line no-unused-vars
  const [_, taxTypeLabel, taxNumber] = options.taxInfo.split(delimiter)

  const hasTaxTypeLabel = taxTypeLabel && taxTypeLabel.length > 0
  const taxes = subtotal * taxRate
  const taxesLabel = `${currencySymbol}${taxes.toFixed(2)}`

  const total = subtotal + subtotal * taxRate
  const totalLabel = `${currencySymbol}${total.toFixed(2)}`

  const notes = [...options.note]

  const path = options.output || `${options.type}_${documentId}.pdf`

  const processedOptions = {
    ...options,
    ...businessInfo,
    ...clientInfo,
    currencyCode,
    currencySymbol,
    documentId,
    documentTypeLabel,
    items,
    subtotalLabel,
    taxesLabel,
    ...(hasTaxTypeLabel ? { taxTypeLabel } : { taxTypeLabel: null }),
    taxRateLabel,
    taxNumber,
    totalLabel,
    notes,
    path,
  }

  delete processedOptions.business
  delete processedOptions.client
  delete processedOptions.detail
  delete processedOptions.item
  delete processedOptions.note
  delete processedOptions.taxInfo

  return processedOptions
}

const buildBusinessInfoMarkup = (options) =>
  [
    `<p class="text-gray-500 font-bold">${options.businessName}</p>`,
    ...options.businessDetails.map(
      (businessDetail) =>
        `<p class="text-gray-500 text-sm">${businessDetail}</p>`
    ),
  ].join('')

const buildClientInfoMarkup = (options) =>
  [
    `${options.clientName}<br/>`,
    ...options.clientDetails.map(
      (row, index) =>
        `${row}${index === options.clientDetails.length - 1 ? '' : '<br/>'}`
    ),
  ].join('')

const buildDocumentItems = (options) =>
  options.items
    .map(
      ({
        service,
        details,
        units,
        rateLabel,
        totalLabel,
        dateLabel,
        isFlat,
      }) => {
        const cells = `
      <td class="px-3 py-2">
        ${service}${
          dateLabel ? ` <span class="text-gray-500">${dateLabel}</span>` : ''
        }
        ${
          details
            ? '<br />' +
              details
                .map(
                  (detail) =>
                    `<span class="text-sm">&nbsp;-&nbsp;${detail}</span>`
                )
                .join('<br />')
            : ''
        }
      </td>
      <td class="px-3 py-2">${isFlat ? '' : units}</td>
      <td class="px-3 py-2">${rateLabel}</td>
      <td class="px-3 py-2 text-right">${totalLabel}</td>
    `

        return `<tr class="border-b border-gray-200">${cells}</tr>`
      }
    )
    .join('')

const buildNotes = (options) =>
  options.notes
    .map(
      (note) => `
    <p class="text-gray-500 mt-2 text-sm text-center">
      ${note}
    </p>
  `
    )
    .join('')

export const buildHtml = (options) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <title>${options.documentTypeLabel} ${options.documentId} - ${
      options.businessName
    }</title>
    <style>
      :root {}

      body {
        font-family: var(--font-inter), sans-serif;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-inter), sans-serif;
      }
    </style>
  </head>
  <body>
    <div class="bg-white p-8 rounded-lg">
      <div class="flex justify-between items-center mb-8">
        <div>
          ${buildBusinessInfoMarkup(options)}
        </div>
        <div class="text-right">
          <h1 class="text-2xl font-bold">${options.documentTypeLabel}</h1>
          <p class="text-gray-500 text-sm">${options.documentTypeLabel} #: ${
            options.documentId
          }</p>
          ${
            options.taxNumber
              ? `<p class="text-gray-500 text-sm">Tax #: ${options.taxNumber}`
              : ''
          }
          <p class="text-gray-500 text-sm">Date: ${options.date}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 class="text-lg font-bold">Bill To:</h2>
          <p class="text-gray-500 text-sm mt-2">
            ${buildClientInfoMarkup(options)}
          </p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full table-auto text-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-500 text-left">
              <th class="px-3 py-2 font-medium">Service</th>
              <th class="px-3 py-2 font-medium">Units</th>
              <th class="px-3 py-2 font-medium">Rate</th>
              <th class="px-3 py-2 font-medium text-right">Total (${
                options.currencyCode
              })</th>
            </tr>
          </thead>
          <tbody>
            ${buildDocumentItems(options)}
          </tbody>
        </table>
      </div>
      <div class="mt-8 text-right">
        <p class="text-gray-500 text-sm">Subtotal: ${options.subtotalLabel}</p>
        <p class="text-gray-500 text-sm">
          Tax (${options.taxRateLabel}${
            options.taxTypeLabel ? ` ${options.taxTypeLabel}` : ''
          }): ${options.taxesLabel}
        </p>
        <p class="text-xl font-bold">Total: ${options.totalLabel}</p>
      </div>
      <div class="mt-8">
        ${buildNotes(options)}
      </div>
    </div>
  </body>
</html>
`
