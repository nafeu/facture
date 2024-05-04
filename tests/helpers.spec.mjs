import {
  processOptions,
  buildHtml,
  getDateLabelFromYYYYMMDD,
} from '../src/helpers.mjs'

describe('processOptions', () => {
  it('should return a processed set of options', () => {
    const options = {
      business:
        'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
      client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
      currency: 'CAD',
      date: '2024-05-03',
      delimiter: '|',
      documentId: 'NN0141232',
      item: [
        {
          details: [],
          item: 'Work Stuff|1|45/hr|2024-01-03',
        },
        {
          details: ['Task1', 'Task2', 'Task3'],
          item: 'More Work Stuff|2|30.52/day|2024-01-04',
        },
      ],
      detail: [
        {
          details: [],
          item: 'Work Stuff|1|45/hr|2024-01-03',
        },
        {
          details: ['Task1', 'Task2', 'Task3'],
          item: 'More Work Stuff|2|30.52/day|2024-01-04',
        },
      ],
      note: [
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ],
      taxInfo: '0.13|GST|1234RT001',
      type: 'invoicepaid',
    }

    const result = processOptions(options)

    expect(result.documentTypeLabel).toEqual('Invoice (Paid)')
    expect(result.documentId).toEqual('NN0141232')
    expect(result.currencySymbol).toEqual('CA$')
    expect(result.currencyCode).toEqual('CAD')

    expect(result.businessName).toEqual('Nafeu Nasir Media Solutions')
    expect(result.businessDetails).toEqual([
      '9-4123 Racoon Street',
      'Toronto, ON, Canada',
      'M6H 4K1',
    ])

    expect(result.clientName).toEqual('Client A')
    expect(result.clientDetails).toEqual([
      '5 ABC Avenue',
      'Funtown, MI, US',
      '44124',
    ])

    expect(result.taxTypeLabel).toEqual('GST')
    expect(result.taxRateLabel).toEqual('13%')
    expect(result.taxNumber).toEqual('1234RT001')

    expect(result.items).toEqual([
      {
        date: '2024-01-03',
        dateLabel: 'Wed Jan 03 2024',
        rate: 45,
        rateLabel: 'CA$45.00 / hour',
        service: 'Work Stuff',
        total: 45,
        totalLabel: 'CA$45.00',
        units: 1,
      },
      {
        date: '2024-01-04',
        dateLabel: 'Thu Jan 04 2024',
        details: ['Task1', 'Task2', 'Task3'],
        rate: 30.52,
        rateLabel: 'CA$30.52 / day',
        service: 'More Work Stuff',
        total: 61.04,
        totalLabel: 'CA$61.04',
        units: 2,
      },
    ])

    expect(result.subtotalLabel).toEqual(`CA$106.04`)
    expect(result.taxesLabel).toEqual(`CA$13.79`)
    expect(result.totalLabel).toEqual(`CA$119.83`)

    expect(result.path).toEqual('invoicepaid_NN0141232.pdf')

    expect(result.notes).toEqual([
      'Please pay all invoices within <strong>15 days</strong> of receiving this.',
      'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
    ])
  })
})

describe('buildHtml', () => {
  it('should return an html file with valid interpolated options', () => {
    const exampleProcessedOptions = {
      currency: 'CAD',
      date: '2024-05-03',
      delimiter: '|',
      documentId: 'NN0141232',
      note: [
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ],
      taxInfo: '0.13|GST|1234RT001',
      type: 'invoicepaid',
      businessName: 'Nafeu Nasir Media Solutions',
      businessDetails: [
        '9-4123 Racoon Street',
        'Toronto, ON, Canada',
        'M6H 4K1',
      ],
      clientName: 'Client A',
      clientDetails: ['5 ABC Avenue', 'Funtown, MI, US', '44124'],
      currencyCode: 'CAD',
      currencySymbol: 'CA$',
      documentTypeLabel: 'Invoice (Paid)',
      items: [
        {
          date: '2024-01-03',
          dateLabel: 'Wed Jan 3 2024',
          service: 'Work Stuff',
          units: 1,
          rate: 45,
          rateLabel: 'CA$45.00 / hour',
          total: 45,
          totalLabel: 'CA$45.00',
        },
        {
          date: '2024-01-04',
          dateLabel: 'Thu Jan 4 2024',
          service: 'More Work Stuff',
          units: 2,
          details: ['Task1', 'Task2', 'Task3'],
          rate: 30.52,
          rateLabel: 'CA$30.52 / day',
          total: 61.04,
          totalLabel: 'CA$61.04',
        },
      ],
      subtotalLabel: 'CA$106.04',
      taxesLabel: 'CA$13.79',
      taxTypeLabel: 'GST',
      taxRateLabel: '13%',
      taxNumber: '1234RT001',
      totalLabel: 'CA$119.83',
      notes: [
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ],
      path: 'invoicepaid_NN0141232.pdf',
    }

    const result = buildHtml(exampleProcessedOptions)
      .split('\n')
      .map((line) => line.trim())

    expect(result).toEqual(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Invoice (Paid) NN0141232 - Nafeu Nasir Media Solutions</title>
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
                <p class="text-gray-500 font-bold">Nafeu Nasir Media Solutions</p><p class="text-gray-500 text-sm">9-4123 Racoon Street</p><p class="text-gray-500 text-sm">Toronto, ON, Canada</p><p class="text-gray-500 text-sm">M6H 4K1</p>
              </div>
              <div class="text-right">
                <h1 class="text-2xl font-bold">Invoice (Paid)</h1>
                <p class="text-gray-500 text-sm">Invoice (Paid) #: NN0141232</p>
                <p class="text-gray-500 text-sm">Tax #: 1234RT001
                <p class="text-gray-500 text-sm">Date: 2024-05-03</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 class="text-lg font-bold">Bill To:</h2>
                <p class="text-gray-500 text-sm mt-2">
                  Client A<br/>5 ABC Avenue<br/>Funtown, MI, US<br/>44124
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
                    <th class="px-3 py-2 font-medium text-right">Total (CAD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="px-3 py-2">
                      Work Stuff <span class=\"text-gray-500\">Wed Jan 3 2024</span>

                    </td>
                    <td class="px-3 py-2">1</td>
                    <td class="px-3 py-2">CA$45.00 / hour</td>
                    <td class="px-3 py-2 text-right">CA$45.00</td>
                  </tr><tr class="border-b border-gray-200">
                    <td class="px-3 py-2">
                      More Work Stuff <span class=\"text-gray-500\">Thu Jan 4 2024</span>
                      <br /><span class="text-sm">&nbsp;-&nbsp;Task1</span><br /><span class="text-sm">&nbsp;-&nbsp;Task2</span><br /><span class="text-sm">&nbsp;-&nbsp;Task3</span>
                    </td>
                    <td class="px-3 py-2">2</td>
                    <td class="px-3 py-2">CA$30.52 / day</td>
                    <td class="px-3 py-2 text-right">CA$61.04</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-8 text-right">
              <p class="text-gray-500 text-sm">Subtotal: CA$106.04</p>
              <p class="text-gray-500 text-sm">
                Tax (13% GST): CA$13.79
              </p>
              <p class="text-xl font-bold">Total: CA$119.83</p>
            </div>
            <div class="mt-8">

              <p class="text-gray-500 mt-2 text-sm text-center">
                Please pay all invoices within <strong>15 days</strong> of receiving this.
              </p>

              <p class="text-gray-500 mt-2 text-sm text-center">
                If you have any questions about this invoice please contact nafeu.nasir@gmail.com
              </p>

            </div>
          </div>
        </body>
      </html>
    `
        .split('\n')
        .map((line) => line.trim())
    )
  })
})

describe('getDateLabelFromYYYYMMDD', () => {
  it('should return the correct human readble date string based on input date', () => {
    expect(getDateLabelFromYYYYMMDD('2024-01-03')).toEqual('Wed Jan 03 2024')
  })
})
