import puppeteer from 'puppeteer'
import { Command } from 'commander'
import yaml from 'js-yaml'

import {
  DEFAULT_CURRENCY,
  DEFAULT_DELIMITER,
  DEFAULT_INVOICE_TYPE,
  DEFAULT_NOTES,
  VALID_DOCUMENT_TYPES,
} from './constants.mjs'

import {
  buildHtml,
  collectItem,
  collectDetail,
  collectMultipleStringArguments,
  getCurrentDateInYYYYMMDD,
  processOptions,
} from './helpers.mjs'

export const handleGenerate = async (options) => {
  let processedOptions

  try {
    processedOptions = processOptions(options)
  } catch (error) {
    console.log(error.message)
     
    process.exit(1)
  }

  if (options.log) {
    console.log(`[ facture v0.1.0 ] Processed options:\n`)
    console.log(yaml.dump(processedOptions))
  }

  if (options.dryRun) {
    console.log(`[ facture v0.1.0 ] Dry run successful, options are valid`)
    return
  }

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(buildHtml(processedOptions), {
    waitUntil: 'networkidle0',
  })

  await page.pdf({
    path: processedOptions.path,
    format: 'A4',
    printBackground: true,
  })

  await browser.close()

  console.log(
    `[ facture v0.1.0 ] Document exported successfully to ${processedOptions.path}`
  )
}

export const program = new Command()

program
  .name('facture')
  .description(
    'Generate sleek and minimal invoices, quotes or receipts as PDFs'
  )
  .version('0.1.0')
  .option(
    '-u, --documentId <string>',
    'The unique ID for your document (ie. Invoice ID, Receipt ID)'
  )
  .option(
    '-e, --delimiter <character>',
    'The character to split multi-part params such as business, client, items and taxInfo',
    DEFAULT_DELIMITER
  )
  .option(
    '-t, --type <string>',
    `Document type: ${VALID_DOCUMENT_TYPES.join(', ').trim()}`,
    DEFAULT_INVOICE_TYPE
  )
  .requiredOption(
    '-b, --business <business_name|business_details...(optional)|>',
    "All your business information seperated by '|' (or custom delimiter)"
  )
  .option(
    '-n, --note <string>',
    'Any additional info to add to the bottom of the document',
    collectMultipleStringArguments,
    DEFAULT_NOTES
  )
  .option(
    '-c, --client <client_name|client_details...(optional)|>',
    "All of your client's information seperated by '|' (or custom delimiter)"
  )
  .option(
    '-i, --item <service|quantity|rate|date(optional)>',
    'Add line items to the document',
    collectItem
  )
  .option(
    '-s, --detail <string>',
    'Extra details about the last item listed',
    collectDetail
  )
  .option(
    '-r, --currency <currency_code>',
    'Three digit currency code (ie. USD, CAD)',
    DEFAULT_CURRENCY
  )
  .option(
    '-x, --taxInfo <rate|type(optional)|number(optional)>',
    'Tax info associated with this transaction (ie. 0.13|GST|1234RT0001)'
  )
  .option(
    '-d, --date <YYYY-MM-DD>',
    'Date of the document in YYYY-MM-DD format',
    getCurrentDateInYYYYMMDD()
  )
  .option('-o, --output <string>', 'Name of the pdf file to output')
  .option(
    '-y, --dryRun',
    'Check if options can be processed to build a valid pdf output'
  )
  .option(
    '-l, --log',
    'Log the processed options (subtotal, total, display labels, etc.)'
  )
  .action(handleGenerate)
