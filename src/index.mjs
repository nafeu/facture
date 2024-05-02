import puppeteer from 'puppeteer';
import { Command } from 'commander';

import {
  DEFAULT_CURRENCY,
  DEFAULT_DELIMITER,
  DEFAULT_INVOICE_TYPE,
  DEFAULT_ITEMS,
  DEFAULT_NOTES,
  VALID_DOCUMENT_TYPES
} from './constants.mjs'

import {
  buildHtml,
  collectMultipleStringArguments,
  getCurrentDateInYYYYMMDD,
  processOptions,
} from './helpers.mjs'

export const handleGenerate = async options => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const processedOptions = processOptions(options)

  await page.setContent(buildHtml(processedOptions), { waitUntil: 'networkidle0' });

  await page.pdf({
    path: processOptions.path,
    format: 'A4',
    printBackground: true
  });

  await browser.close();

  console.log(`[ facture v0.1.0 ] Document exported successfully to ${processedOptions.path}`)
}

export const program = new Command();

program
  .name('facture')
  .description('Generate sleek and minimal invoices, quotes or receipts as PDFs')
  .version('0.1.0')
  .option('-u, --uniqueId <string>', 'The unique ID for your document (ie. Invoice ID, Receipt ID)')
  .option('-l, --delimiter <character>', 'The character to split multi-line input params (ie. business, client)', DEFAULT_DELIMITER)
  .option('-t, --type <string>', `Document type: ${VALID_DOCUMENT_TYPES.join(', ').trim()}`, DEFAULT_INVOICE_TYPE)
  .requiredOption('-b, --business <string>', 'All your business information seperated by \'|\' (or custom delimiter)')
  .requiredOption('-p, --phone <string>', 'Your business phone number')
  .requiredOption('-e, --email <string>', 'Your business email address')
  .option('-n, --note <string>', 'Any additional info to add to the bottom of the document')
  .option('-c, --client <string>', 'All of your client\'s information seperated by \'|\' (or custom delimiter)')
  .option('-q, --chequeName <string>', 'The full name to make any cheques out to')
  .option('-i, --item <string>', 'Add line items to the document', collectMultipleStringArguments, DEFAULT_ITEMS)
  .option('-r, --currency <currency_code>', 'Three digit currency code (ie. USD, CAD)', DEFAULT_CURRENCY)
  .option('-x, --taxRate <percentage>', 'Percentage of tax to be applied to the subtotal (ie. 0.13 or 13%)')
  .option('-s, --taxNumber <string>', 'Tax identification number (ie. GST/HST number in Canada, TN in US)')
  .option('-d, --date <YYYY-MM-DD>', 'Date of the document in YYYY-MM-DD format', getCurrentDateInYYYYMMDD())
  .option('-o, --output', 'Name of the pdf output')
  .action(handleGenerate);
