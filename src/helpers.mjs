import { CURRENCY_DATA, DOCUMENT_TYPE_LABEL_MAPPING, RATE_INTERVAL_LABELS } from './constants.mjs'

export const getCurrentDateInYYYYMMDD = () => {
  const date  = new Date();
  const year  = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day   = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const collectMultipleStringArguments = (item, previousItems) => previousItems.concat(item)

export const processOptions = options => {
  const documentTypeLabel = DOCUMENT_TYPE_LABEL_MAPPING[options.type]
  const documentId        = options.uniqueId || '[TODO: GENERATE IDs]'

  const currencySymbol = CURRENCY_DATA[options.currency.toUpperCase()].symbol
  const currencyCode   = CURRENCY_DATA[options.currency.toUpperCase()].code

  const businessInfo = (() => {
    const [businessName, ...businessDetails] = options.business.split(options.delimiter)

    return {
      businessName,
      businessDetails
    }
  })()

  const clientInfo = (() => {
    const [clientName, ...clientDetails] = options.client.split(options.delimiter)

    return {
      clientName,
      clientDetails
    }
  })()

  const items = options.item.map(lineItem => {
    const [service, unitsString, rateIntervalString, ...details] = lineItem.split(options.delimiter)

    const hasDetails = details.length > 0;

    const units = Number(unitsString)

    const [rateString, interval] = rateIntervalString.split('/').map(str => str.trim())
    const rate                   = Number(rateString)
    const intervalLabel          = interval ? ` / ${RATE_INTERVAL_LABELS[interval]}` : ''
    const amountLabel            = `${currencySymbol}${rate.toFixed(2)}`
    const rateLabel              = `${amountLabel}${intervalLabel}`
    const total                  = units * rate
    const totalLabel             = `${currencySymbol}${total.toFixed(2)}`

    return {
      service,
      units,
      ...(hasDetails ? ({ details }) : {}),
      rate,
      rateLabel,
      total,
      totalLabel
    }
  })

  const subtotal      = items.reduce((sum, { total }) => { sum += total; return sum; }, 0)
  const subtotalLabel = `${currencySymbol}${subtotal.toFixed(2)}`

  const taxRate = (() => {
    if (options.taxRate.includes('%')) {
      return Number(options.taxRate.split('%')[0]) / 100
    }

    return Number(options.taxRate)
  })()

  const taxRateLabel = (() => {
    if (options.taxRate.includes('%')) {
      return options.taxRate
    }

    return `${taxRate * 100}%`
  })()

  const taxes      = subtotal * taxRate
  const taxesLabel = `${currencySymbol}${taxes.toFixed(2)}`

  const total      = subtotal + (subtotal * taxRate)
  const totalLabel = `${currencySymbol}${total.toFixed(2)}`

  const path = options.output
    || `${options.type}_${documentId}.pdf`

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
    taxRateLabel,
    totalLabel,
    path
  }

  return processedOptions
}

const buildBusinessInfoMarkup = options => [
  `<p class="text-gray-500 font-bold">${options.businessName}</p>`,
  ...options.businessDetails.map(businessDetail => `<p class="text-gray-500 text-sm">${businessDetail}</p>`)
].join('')

const buildClientInfoMarkup = options => [
  `${options.clientName}<br/>`,
  ...options.clientDetails.map((row, index) => `${row}${(index === options.client.length - 1) ? '' : '<br/>'}`)
].join('')

const buildDocumentItems = options => options
  .items
  .map(({ service, details, units, rateLabel, totalLabel }) => {
    const cells = `
      <td class="px-3 py-2">
        ${service}
        ${details ? '<br />' + details.map(detail => `<span class="text-sm">&nbsp;-&nbsp;${detail}</span>`).join('<br />') : ''}
      </td>
      <td class="px-3 py-2">${units}</td>
      <td class="px-3 py-2">${rateLabel}</td>
      <td class="px-3 py-2 text-right">${totalLabel}</td>
    `;

    return `<tr class="border-b border-gray-200">${cells}</tr>`;
  }).join('')

const buildNotes = options => options
  .notes
  .map(({ text, classes }) => `
    <p class="text-gray-500 mt-2 ${classes}">
      ${text}
    </p>
  `)
  .join('')

export const buildHtml = options => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <title>[TODO: ADD TITLE]</title>
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
          <p class="text-gray-500 text-sm">${options.documentTypeLabel} #: ${options.documentId}</p>
          ${options.taxNumber ? `<p class="text-gray-500 text-sm">Tax #: ${options.taxNumber}` : ''}
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
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-100 text-gray-500 text-left">
              <th class="px-3 py-2 font-medium">Service</th>
              <th class="px-3 py-2 font-medium">Units</th>
              <th class="px-3 py-2 font-medium">Rate</th>
              <th class="px-3 py-2 font-medium text-right">Total (${options.currencyCode})</th>
            </tr>
          </thead>
          <tbody>
            ${buildDocumentItems(options)}
          </tbody>
        </table>
      </div>
      <div class="mt-8 text-right">
        <p class="text-gray-500 text-sm">Subtotal: ${options.subtotalLabel}</p>
        <p class="text-gray-500 text-sm">Tax (${options.taxRateLabel}): ${options.taxesLabel}</p>
        <p class="text-2xl font-bold">Total (${options.currencyCode}): ${options.totalLabel}</p>
      </div>
      <div class="mt-8">
        ${options.note ? `
          <p class="text-gray-500 mt-2">
            ${options.note}
          </p>
        ` : ''}
        <p class="text-gray-500 mt-2">
          Make all cheques payable to <strong>${options.chequeName}</strong>
        </p>
        <p class="text-gray-500 mt-2">
          If you have any questions about this document, please call <strong>${options.phone}</strong> or send an email to <strong>${options.email}</strong>
        </p>
      </div>
    </div>
  </body>
</html>
`
