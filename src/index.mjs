import puppeteer from 'puppeteer';
import { Command } from 'commander';

import {
  CURRENCY_DATA,
  DEFAULT_CURRENCY,
  DEFAULT_DELIMITER,
  DEFAULT_INVOICE_TYPE,
  DEFAULT_ITEMS,
  DOCUMENT_TYPE_INVOICE,
  DOCUMENT_TYPE_INVOICE_PAID,
  DOCUMENT_TYPE_LABEL_MAPPING,
  DOCUMENT_TYPE_QUOTE,
  DOCUMENT_TYPE_RECEIPT,
  VALID_DOCUMENT_TYPES,
} from './constants.mjs'

const uppercaseFirstLetter = str => `${str[0].toUpperCase()}${str.slice(1)}`
const collectItems         = (item, previousItems) => previousItems.concat(item)

const buildBusinessInfoMarkup = options => options
  .business
  .split(options.delimiter)
  .map(row => `<p class="text-gray-500 text-sm">${row}</p>`)
  .join('')

const buildClientInfoMarkup = options => options
  .client
  .split(options.delimiter)
  .map((row, index) => `${row}${(index === options.client.length - 1) ? '' : '<br/>'}`)
  .join('')

const getDocumentLabel  = options => DOCUMENT_TYPE_LABEL_MAPPING[options.type]
const getDocumentId     = options => options.uniqueId || '[TODO: GENERATE IDs]'
const getCurrencySymbol = options => CURRENCY_DATA[options.currency.toUpperCase()].symbol
const getCurrencyCode   = options => CURRENCY_DATA[options.currency.toUpperCase()].code
const getPhone          = options => options.phone
const getEmail          = options => options.email
const getDate           = options => '[TODO: Add Date Support]'
const getChequeName     = options => options.chequeName

const buildHtml = options => `
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
          <h1 class="text-2xl font-bold">${getDocumentLabel(options)}</h1>
          <p class="text-gray-500 text-sm">${getDocumentLabel(options)} #: ${getDocumentId(options)}</p>
          <p class="text-gray-500 text-sm">Date: ${getDate(options)}</p>
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
              <th class="px-4 py-3 font-medium">Service</th>
              <th class="px-4 py-3 font-medium">Units</th>
              <th class="px-4 py-3 font-medium">Rate</th>
              <th class="px-4 py-3 font-medium">Total (${getCurrencyCode(options)})</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200">
              <td class="px-4 py-3">Web Development</td>
              <td class="px-4 py-3">$100</td>
              <td class="px-4 py-3">40</td>
              <td class="px-4 py-3">$4,000</td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="px-4 py-3">Mobile App Development</td>
              <td class="px-4 py-3">$120</td>
              <td class="px-4 py-3">20</td>
              <td class="px-4 py-3">$2,400</td>
            </tr>
            <tr class="border-b border-gray-200">
              <td class="px-4 py-3">UI/UX Design</td>
              <td class="px-4 py-3">$80</td>
              <td class="px-4 py-3">10</td>
              <td class="px-4 py-3">$800</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-8 text-right">
        <p class="text-gray-500 text-sm">Subtotal: ${getCurrencySymbol(options)}${'[TODO: ADD SUBTOTAL]'}</p>
        <p class="text-gray-500 text-sm">Tax (${'[TODO: ADD TAX PERCENTAGE]'}): ${getCurrencySymbol(options)}${'[TODO: ADD TAX]'}</p>
        <p class="text-2xl font-bold">Total (${getCurrencyCode(options)}): ${getCurrencySymbol(options)}${'[TODO: ADD TOTAL]'}</p>
      </div>
      <div class="mt-8">
        <p class="text-gray-500 text-sm mt-2">
          Please process all payments within <strong>15 days</strong> of receiving this invoice.
        </p>
        <p class="text-gray-500 text-sm mt-2">
          Make all cheques payable to ${getChequeName(options)}
        </p>
        <p class="text-gray-500 text-sm mt-2">
          If you have any questions about this ${getDocumentLabel(options)}, please call ${getPhone(options)} or email ${getEmail(options)}
        </p>
      </div>
    </div>
  </body>
</html>
`

const handleGenerate = async options => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(buildHtml(options), { waitUntil: 'networkidle0' });

  const pdfOptions = {
    path: 'output.pdf',
    format: 'A4',
    printBackground: true
  };

  await page.pdf(pdfOptions);

  await browser.close();

  console.log(`[ facture v0.1.0 ] Invoice generated successfully!`)
}

export const program = new Command();

program
  .name('facture')
  .description('Generate sleek and minimal invoices, quotes or receipts as PDFs')
  .version('0.1.0')
  .option('-u, --uniqueId <string>', 'The unique ID for your document (ie. Invoice ID, Receipt ID)')
  .option('-d, --delimiter <character>', 'The character to split multi-line input params (ie. business, client)', DEFAULT_DELIMITER)
  .option('-t, --type <string>', `Document type: ${VALID_DOCUMENT_TYPES.join(', ').trim()}`, DEFAULT_INVOICE_TYPE)
  .requiredOption('-b, --business <string>', 'All your business information seperated by \'|\' (or custom delimiter)')
  .requiredOption('-p, --phone <string>', 'Your business phone number')
  .requiredOption('-e, --email <string>', 'Your business email address')
  .option('-n, --note <string>', 'Any additional info to add to the bottom of the document')
  .option('-c, --client <string>', 'All of your client\'s information seperated by \'|\' (or custom delimiter)')
  .option('-q, --chequeName <string>', 'The full name to make any cheques out to')
  .option('-i, --item <string>', 'Add line items to the document', collectItems, DEFAULT_ITEMS)
  .option('-x, --currency <currency_code>', 'Three digit currency code (ie. USD, CAD)', DEFAULT_CURRENCY)
  .action(handleGenerate);
