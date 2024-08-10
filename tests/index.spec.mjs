import { program } from '../src/index.mjs'

describe('program.parse', () => {
  it('should parse the input arguments into options correctly', () => {
    process.argv = [
      'node',
      'facture',
      '-b',
      'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
      '-c',
      'Client A|5 ABC Avenue|Funtown, MI, US|44124',
      '-i',
      'Work Stuff|1|45/hr|2024-01-03',
      '-i',
      'More Work Stuff|2|30/day|2024-01-04',
      '-s',
      'Task1',
      '-s',
      'Task2',
      '-s',
      'Task3',
      '-r',
      'CAD',
      '-f',
      'USD',
      '-x',
      '0.13|GST|1234RT001',
      '-u',
      'NN0141232',
      '-n',
      'Please pay all invoices within <strong>15 days</strong> of receiving this.',
      '-n',
      'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      '-t',
      'invoicepaid',
      '-y',
      '-d',
      '2024-05-03',
    ]

    program.parse(process.argv)
    expect(program.opts()).toEqual({
      business:
        'Nafeu Nasir Media Solutions|9-4123 Racoon Street|Toronto, ON, Canada|M6H 4K1',
      client: 'Client A|5 ABC Avenue|Funtown, MI, US|44124',
      fromCurrency: 'USD',
      currency: 'CAD',
      date: '2024-05-03',
      delimiter: '|',
      documentId: 'NN0141232',
      dryRun: true,
      item: [
        {
          details: [],
          item: 'Work Stuff|1|45/hr|2024-01-03',
        },
        {
          details: ['Task1', 'Task2', 'Task3'],
          item: 'More Work Stuff|2|30/day|2024-01-04',
        },
      ],
      detail: [
        {
          details: [],
          item: 'Work Stuff|1|45/hr|2024-01-03',
        },
        {
          details: ['Task1', 'Task2', 'Task3'],
          item: 'More Work Stuff|2|30/day|2024-01-04',
        },
      ],
      note: [
        'Please pay all invoices within <strong>15 days</strong> of receiving this.',
        'If you have any questions about this invoice please contact nafeu.nasir@gmail.com',
      ],
      taxInfo: '0.13|GST|1234RT001',
      type: 'invoicepaid',
    })
  })
})
