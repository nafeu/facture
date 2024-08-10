import { jest } from '@jest/globals'

import {
  processOptions,
  buildHtml,
  getDateLabelFromYYYYMMDD,
} from '../src/helpers.mjs'

const getHistoricalExchangeRatesMock = jest.fn().mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      '2024-01-02': 0.5,
      '2024-01-03': 0.5,
      '2024-01-04': 0.5,
    })
  })
})

describe('processOptions', () => {
  describe('case 1', () => {
    it('should return a processed set of options', async () => {
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

      const result = await processOptions(
        options,
        getHistoricalExchangeRatesMock
      )

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

      expect(result.path).toEqual(
        'nafeu-nasir-media-solutions-invoicepaid-NN0141232.pdf'
      )

      expect(result.notes).toEqual([
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ])
    })
  })
  describe('case 2', () => {
    it('should return a processed set of options', async () => {
      const options = {
        business:
          'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
        client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
        currency: 'USD',
        date: '2024-02-06',
        delimiter: '|',
        documentId: 'NN0141233',
        item: [
          {
            details: [],
            item: 'Work Stuff||375',
          },
        ],
        detail: [
          {
            details: [],
            item: 'Work Stuff||375',
          },
        ],
        note: [],
        taxInfo: '11%||88881514',
        type: 'invoice',
      }

      const result = await processOptions(
        options,
        getHistoricalExchangeRatesMock
      )

      expect(result.documentTypeLabel).toEqual('Invoice')
      expect(result.documentId).toEqual('NN0141233')
      expect(result.currencySymbol).toEqual('$')
      expect(result.currencyCode).toEqual('USD')

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

      expect(result.taxTypeLabel).toEqual(null)
      expect(result.taxRateLabel).toEqual('11%')
      expect(result.taxNumber).toEqual('88881514')

      expect(result.items).toEqual([
        {
          isFlat: true,
          rate: 375,
          rateLabel: '$375.00',
          service: 'Work Stuff',
          total: 375,
          totalLabel: '$375.00',
          units: 1,
        },
      ])

      expect(result.subtotalLabel).toEqual(`$375.00`)
      expect(result.taxesLabel).toEqual(`$41.25`)
      expect(result.totalLabel).toEqual(`$416.25`)

      expect(result.path).toEqual(
        'nafeu-nasir-media-solutions-invoice-NN0141233.pdf'
      )
    })
  })
  describe('case 3', () => {
    it('should return a processed set of options', async () => {
      const options = {
        business:
          'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
        client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
        currency: 'USD',
        date: '2024-01-07',
        delimiter: '|',
        item: [
          {
            details: [],
            item: 'Freelance Stuff||200',
          },
        ],
        detail: [
          {
            details: [],
            item: 'Freelance Stuff||200',
          },
        ],
        note: [],
        taxInfo: '||88881514',
        type: 'receipt',
      }

      const result = await processOptions(
        options,
        getHistoricalExchangeRatesMock
      )

      expect(result.documentTypeLabel).toEqual('Receipt')
      expect(result.documentId.length).toEqual(14)
      expect(result.currencySymbol).toEqual('$')
      expect(result.currencyCode).toEqual('USD')

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

      expect(result.taxTypeLabel).toEqual(null)
      expect(result.taxRateLabel).toEqual('0%')
      expect(result.taxNumber).toEqual('88881514')

      expect(result.items).toEqual([
        {
          isFlat: true,
          rate: 200,
          rateLabel: '$200.00',
          service: 'Freelance Stuff',
          total: 200,
          totalLabel: '$200.00',
          units: 1,
        },
      ])

      expect(result.subtotalLabel).toEqual(`$200.00`)
      expect(result.taxesLabel).toEqual(`$0.00`)
      expect(result.totalLabel).toEqual(`$200.00`)

      expect(result.path.length).toEqual(54)
    })
  })
  describe('case 4 - when using a fromCurrency', () => {
    it('should return a processed set of options', async () => {
      const options = {
        business:
          'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
        client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
        currency: 'USD',
        fromCurrency: 'CAD',
        date: '2024-05-03',
        delimiter: '|',
        documentId: 'NN0141232',
        item: [
          {
            details: [],
            item: 'Work Stuff|1|convert:45/hr|2024-01-03',
          },
          {
            details: ['Task1', 'Task2', 'Task3'],
            item: 'More Work Stuff|2|30.52/day|2024-01-04',
          },
        ],
        detail: [
          {
            details: [],
            item: 'Work Stuff|1|convert:45/hr|2024-01-03',
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
        taxInfo: '|GST|1234RT001',
        type: 'invoicepaid',
      }

      const result = await processOptions(
        options,
        getHistoricalExchangeRatesMock
      )

      expect(result.documentTypeLabel).toEqual('Invoice (Paid)')
      expect(result.documentId).toEqual('NN0141232')
      expect(result.currencySymbol).toEqual('$')
      expect(result.currencyCode).toEqual('USD')

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
      expect(result.taxRateLabel).toEqual('0%')
      expect(result.taxNumber).toEqual('1234RT001')

      expect(result.items).toEqual([
        {
          date: '2024-01-03',
          dateLabel: 'Wed Jan 03 2024',
          details: ['45.00 CAD = 22.50 USD on 2024-01-03'],
          rate: 22.5,
          rateLabel: '$22.50 / hour',
          service: 'Work Stuff',
          total: 22.5,
          totalLabel: '$22.50',
          units: 1,
        },
        {
          date: '2024-01-04',
          dateLabel: 'Thu Jan 04 2024',
          details: ['Task1', 'Task2', 'Task3'],
          rate: 30.52,
          rateLabel: '$30.52 / day',
          service: 'More Work Stuff',
          total: 61.04,
          totalLabel: '$61.04',
          units: 2,
        },
      ])

      expect(result.subtotalLabel).toEqual(`$83.54`)
      expect(result.taxesLabel).toEqual(`$0.00`)
      expect(result.totalLabel).toEqual(`$83.54`)

      expect(result.path).toEqual(
        'nafeu-nasir-media-solutions-invoicepaid-NN0141232.pdf'
      )

      expect(result.notes).toEqual([
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ])
    })
  })
  describe('case 5 - when using a fromCurrency with root level date only', () => {
    it('should return a processed set of options', async () => {
      const options = {
        business:
          'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
        client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
        currency: 'CAD',
        fromCurrency: 'USD',
        date: '2024-01-02',
        delimiter: '|',
        documentId: 'NN0141232',
        item: [
          {
            details: [],
            item: 'Work Stuff||convert:200|',
          },
          {
            details: ['Task1'],
            item: 'More Work Stuff||convert:100|',
          },
        ],
        note: [
          'Please pay all invoices within <strong>15 days</strong> of receiving this.',
          'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
        ],
        taxInfo: '|GST|1234RT001',
        type: 'invoice',
      }

      const result = await processOptions(
        options,
        getHistoricalExchangeRatesMock
      )

      expect(result.documentTypeLabel).toEqual('Invoice')
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
      expect(result.taxRateLabel).toEqual('0%')
      expect(result.taxNumber).toEqual('1234RT001')

      expect(result.items).toEqual([
        {
          details: ['200.00 USD = 100.00 CAD on 2024-01-02'],
          rate: 100,
          rateLabel: 'CA$100.00',
          isFlat: true,
          service: 'Work Stuff',
          total: 100,
          totalLabel: 'CA$100.00',
          units: 1,
        },
        {
          details: ['Task1', '100.00 USD = 50.00 CAD on 2024-01-02'],
          rate: 50,
          rateLabel: 'CA$50.00',
          isFlat: true,
          service: 'More Work Stuff',
          total: 50,
          totalLabel: 'CA$50.00',
          units: 1,
        },
      ])

      expect(result.subtotalLabel).toEqual(`CA$150.00`)
      expect(result.taxesLabel).toEqual(`CA$0.00`)
      expect(result.totalLabel).toEqual(`CA$150.00`)

      expect(result.path).toEqual(
        'nafeu-nasir-media-solutions-invoice-NN0141232.pdf'
      )

      expect(result.notes).toEqual([
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ])
    })
  })
})

describe('buildHtml', () => {
  describe('case 1', () => {
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
                      Work Stuff <span class="text-gray-500">Wed Jan 3 2024</span>

                    </td>
                    <td class="px-3 py-2">1</td>
                    <td class="px-3 py-2">CA$45.00 / hour</td>
                    <td class="px-3 py-2 text-right">CA$45.00</td>
                  </tr><tr class="border-b border-gray-200">
                    <td class="px-3 py-2">
                      More Work Stuff <span class="text-gray-500">Thu Jan 4 2024</span>
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
  describe('case 2', () => {
    it('should return an html file with valid interpolated options', () => {
      const exampleProcessedOptions = {
        currency: 'USD',
        date: '2024-02-06',
        delimiter: '|',
        documentId: 'NN0141233',
        type: 'invoice',
        businessName: 'Nafeu Nasir Media Solutions',
        businessDetails: [
          '9-4123 Racoon Street',
          'Toronto, ON, Canada',
          'M6H 4K1',
        ],
        clientName: 'Client A',
        clientDetails: ['5 ABC Avenue', 'Funtown, MI, US', '44124'],
        currencyCode: 'USD',
        currencySymbol: '$',
        documentTypeLabel: 'Invoice',
        items: [
          {
            isFlat: true,
            service: 'Work Stuff',
            units: 1,
            rate: 375,
            rateLabel: '$375.00',
            total: 375,
            totalLabel: '$375.00',
          },
        ],
        subtotalLabel: '$375.00',
        taxesLabel: '$41.25',
        taxTypeLabel: null,
        taxRateLabel: '11%',
        taxNumber: '88881514',
        totalLabel: '$416.25',
        notes: [],
        path: 'invoice_NN0141233.pdf',
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
          <title>Invoice NN0141233 - Nafeu Nasir Media Solutions</title>
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
                <h1 class="text-2xl font-bold">Invoice</h1>
                <p class="text-gray-500 text-sm">Invoice #: NN0141233</p>
                <p class="text-gray-500 text-sm">Tax #: 88881514
                <p class="text-gray-500 text-sm">Date: 2024-02-06</p>
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
                    <th class="px-3 py-2 font-medium text-right">Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200">
                    <td class="px-3 py-2">
                      Work Stuff

                    </td>
                    <td class="px-3 py-2"></td>
                    <td class="px-3 py-2">$375.00</td>
                    <td class="px-3 py-2 text-right">$375.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-8 text-right">
              <p class="text-gray-500 text-sm">Subtotal: $375.00</p>
              <p class="text-gray-500 text-sm">
                Tax (11%): $41.25
              </p>
              <p class="text-xl font-bold">Total: $416.25</p>
            </div>
            <div class="mt-8">

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
})

describe('getDateLabelFromYYYYMMDD', () => {
  it('should return the correct human readble date string based on input date', () => {
    expect(getDateLabelFromYYYYMMDD('2024-01-03')).toEqual('Wed Jan 03 2024')
  })
})
