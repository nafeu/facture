import { processOptions } from '../src/helpers.mjs'

describe('processOptions', () => {
  it('should return a processed set of options', () => {
    const options = {
      delimiter: '|',
      type: 'invoicepaid',
      item: [ 'Work Stuff|1|45/hr', 'More Work Stuff|2|30.52/day|Task1|Task2|Task3' ],
      currency: 'USD',
      business: 'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
      phone: '+1(416)416-4166',
      client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
      email: 'nafeu.nasir@gmail.com',
      chequeName: 'Nafeu Nasir',
      taxRate: '0.13',
      taxNumber: '5124RT001',
      note: 'Please pay all invoices within <strong>15 days</strong> of receiving this.',
      uniqueId: 'NN0141232'
    }

    const result = processOptions(options);

    expect(result.documentTypeLabel).toEqual('Invoice (Paid)')
    expect(result.documentId).toEqual('NN0141232')
    expect(result.currencySymbol).toEqual('$')
    expect(result.currencyCode).toEqual('USD')

    expect(result.businessName).toEqual('Nafeu Nasir Media Solutions')
    expect(result.businessDetails).toEqual([
      '9-4123 Racoon Street',
      'Toronto, ON, Canada',
      'M6H 4K1'
    ])

    expect(result.clientName).toEqual('Client A')
    expect(result.clientDetails).toEqual([
      '5 ABC Avenue',
      'Funtown, MI, US',
      '44124'
    ])

    expect(result.taxRateLabel).toEqual('13%')

    expect(result.items).toEqual([
      {
        service: 'Work Stuff',
        units: 1,
        rate: 45,
        rateLabel: '$45.00 / hour',
        total: 45,
        totalLabel: '$45.00'
      },
      {
        service: 'More Work Stuff',
        details: ['Task1', 'Task2', 'Task3'],
        units: 2,
        rate: 30.52,
        rateLabel: '$30.52 / day',
        total: 61.04,
        totalLabel: '$61.04'
      }
    ])

    expect(result.subtotalLabel).toEqual(`$106.04`)
    expect(result.taxesLabel).toEqual(`$13.79`)
    expect(result.totalLabel).toEqual(`$119.83`)
  })
})
