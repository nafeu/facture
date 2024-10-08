import { readFile } from 'node:fs/promises'

const fileUrl = new URL('../package.json', import.meta.url)
const parsedPackageJSON = JSON.parse(await readFile(fileUrl, 'utf8'))

export const VERSION = parsedPackageJSON.version

export const DOCUMENT_TYPE_INVOICE = 'invoice'
export const DOCUMENT_TYPE_INVOICE_PAID = 'invoicepaid'
export const DOCUMENT_TYPE_QUOTE = 'quote'
export const DOCUMENT_TYPE_RECEIPT = 'receipt'

export const DOCUMENT_TYPE_LABEL_MAPPING = {
  [DOCUMENT_TYPE_INVOICE]: 'Invoice',
  [DOCUMENT_TYPE_INVOICE_PAID]: 'Invoice (Paid)',
  [DOCUMENT_TYPE_QUOTE]: 'Quote',
  [DOCUMENT_TYPE_RECEIPT]: 'Receipt',
}

export const VALID_DOCUMENT_TYPES = Object.keys(DOCUMENT_TYPE_LABEL_MAPPING)

export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_DELIMITER = '|'
export const DEFAULT_INVOICE_TYPE = DOCUMENT_TYPE_INVOICE
export const DEFAULT_NOTES = []

export const RATE_INTERVAL_LABELS = {
  d: 'day',
  day: 'day',
  h: 'hour',
  hour: 'hour',
  hr: 'hour',
  m: 'month',
  mo: 'month',
  mon: 'month',
  month: 'month',
  w: 'week',
  week: 'week',
  wk: 'week',
}

// Reference: https://github.com/bitfactory-robin-martijn/common-currency/blob/main/common-currency.json
export const CURRENCY_DATA = {
  AED: {
    symbol: 'AED',
    code: 'AED',
    name: 'United Arab Emirates Dirham',
    namePlural: 'UAE dirhams',
  },
  AFN: {
    symbol: 'Af',
    code: 'AFN',
    name: 'Afghan Afghani',
    namePlural: 'Afghan Afghanis',
  },
  ALL: {
    symbol: 'ALL',
    code: 'ALL',
    name: 'Albanian Lek',
    namePlural: 'Albanian lekë',
  },
  AMD: {
    symbol: 'AMD',
    code: 'AMD',
    name: 'Armenian Dram',
    namePlural: 'Armenian drams',
  },
  ARS: {
    symbol: 'AR$',
    code: 'ARS',
    name: 'Argentine Peso',
    namePlural: 'Argentine pesos',
  },
  AUD: {
    symbol: 'AU$',
    code: 'AUD',
    name: 'Australian Dollar',
    namePlural: 'Australian dollars',
  },
  AZN: {
    symbol: 'man.',
    code: 'AZN',
    name: 'Azerbaijani Manat',
    namePlural: 'Azerbaijani manats',
  },
  BAM: {
    symbol: 'KM',
    code: 'BAM',
    name: 'Bosnia-Herzegovina Convertible Mark',
    namePlural: 'Bosnia-Herzegovina convertible marks',
  },
  BDT: {
    symbol: 'Tk',
    code: 'BDT',
    name: 'Bangladeshi Taka',
    namePlural: 'Bangladeshi takas',
  },
  BGN: {
    symbol: 'BGN',
    code: 'BGN',
    name: 'Bulgarian Lev',
    namePlural: 'Bulgarian leva',
  },
  BHD: {
    symbol: 'BD',
    code: 'BHD',
    name: 'Bahraini Dinar',
    namePlural: 'Bahraini dinars',
  },
  BIF: {
    symbol: 'FBu',
    code: 'BIF',
    name: 'Burundian Franc',
    namePlural: 'Burundian francs',
  },
  BND: {
    symbol: 'BN$',
    code: 'BND',
    name: 'Brunei Dollar',
    namePlural: 'Brunei dollars',
  },
  BOB: {
    symbol: 'Bs',
    code: 'BOB',
    name: 'Bolivian Boliviano',
    namePlural: 'Bolivian bolivianos',
  },
  BRL: {
    symbol: 'R$',
    code: 'BRL',
    name: 'Brazilian Real',
    namePlural: 'Brazilian reals',
  },
  BWP: {
    symbol: 'BWP',
    code: 'BWP',
    name: 'Botswanan Pula',
    namePlural: 'Botswanan pulas',
  },
  BYN: {
    symbol: 'Br',
    code: 'BYN',
    name: 'Belarusian Ruble',
    namePlural: 'Belarusian rubles',
  },
  BZD: {
    symbol: 'BZ$',
    code: 'BZD',
    name: 'Belize Dollar',
    namePlural: 'Belize dollars',
  },
  CAD: {
    symbol: 'CA$',
    code: 'CAD',
    name: 'Canadian Dollar',
    namePlural: 'Canadian dollars',
  },
  CDF: {
    symbol: 'CDF',
    code: 'CDF',
    name: 'Congolese Franc',
    namePlural: 'Congolese francs',
  },
  CHF: {
    symbol: 'CHF',
    code: 'CHF',
    name: 'Swiss Franc',
    namePlural: 'Swiss francs',
  },
  CLP: {
    symbol: 'CL$',
    code: 'CLP',
    name: 'Chilean Peso',
    namePlural: 'Chilean pesos',
  },
  CNY: {
    symbol: 'CN¥',
    code: 'CNY',
    name: 'Chinese Yuan',
    namePlural: 'Chinese yuan',
  },
  COP: {
    symbol: 'CO$',
    code: 'COP',
    name: 'Colombian Peso',
    namePlural: 'Colombian pesos',
  },
  CRC: {
    symbol: '₡',
    code: 'CRC',
    name: 'Costa Rican Colón',
    namePlural: 'Costa Rican colóns',
  },
  CUP: {
    symbol: 'MN$',
    code: 'CUP',
    name: 'Cuban peso',
    namePlural: 'Cuban pesos',
  },
  CVE: {
    symbol: 'CV$',
    code: 'CVE',
    name: 'Cape Verdean Escudo',
    namePlural: 'Cape Verdean escudos',
  },
  CZK: {
    symbol: 'Kč',
    code: 'CZK',
    name: 'Czech Republic Koruna',
    namePlural: 'Czech Republic korunas',
  },
  DJF: {
    symbol: 'Fdj',
    code: 'DJF',
    name: 'Djiboutian Franc',
    namePlural: 'Djiboutian francs',
  },
  DKK: {
    symbol: 'Dkr',
    code: 'DKK',
    name: 'Danish Krone',
    namePlural: 'Danish kroner',
  },
  DOP: {
    symbol: 'RD$',
    code: 'DOP',
    name: 'Dominican Peso',
    namePlural: 'Dominican pesos',
  },
  DZD: {
    symbol: 'DA',
    code: 'DZD',
    name: 'Algerian Dinar',
    namePlural: 'Algerian dinars',
  },
  EEK: {
    symbol: 'Ekr',
    code: 'EEK',
    name: 'Estonian Kroon',
    namePlural: 'Estonian kroons',
  },
  EGP: {
    symbol: 'EGP',
    code: 'EGP',
    name: 'Egyptian Pound',
    namePlural: 'Egyptian pounds',
  },
  ERN: {
    symbol: 'Nfk',
    code: 'ERN',
    name: 'Eritrean Nakfa',
    namePlural: 'Eritrean nakfas',
  },
  ETB: {
    symbol: 'Br',
    code: 'ETB',
    name: 'Ethiopian Birr',
    namePlural: 'Ethiopian birrs',
  },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', namePlural: 'euros' },
  GBP: {
    symbol: '£',
    code: 'GBP',
    name: 'British Pound Sterling',
    namePlural: 'British pounds sterling',
  },
  GEL: {
    symbol: 'GEL',
    code: 'GEL',
    name: 'Georgian Lari',
    namePlural: 'Georgian laris',
  },
  GHS: {
    symbol: 'GH₵',
    code: 'GHS',
    name: 'Ghanaian Cedi',
    namePlural: 'Ghanaian cedis',
  },
  GNF: {
    symbol: 'FG',
    code: 'GNF',
    name: 'Guinean Franc',
    namePlural: 'Guinean francs',
  },
  GTQ: {
    symbol: 'GTQ',
    code: 'GTQ',
    name: 'Guatemalan Quetzal',
    namePlural: 'Guatemalan quetzals',
  },
  HKD: {
    symbol: 'HK$',
    code: 'HKD',
    name: 'Hong Kong Dollar',
    namePlural: 'Hong Kong dollars',
  },
  HNL: {
    symbol: 'HNL',
    code: 'HNL',
    name: 'Honduran Lempira',
    namePlural: 'Honduran lempiras',
  },
  HRK: {
    symbol: 'kn',
    code: 'HRK',
    name: 'Croatian Kuna',
    namePlural: 'Croatian kunas',
  },
  HUF: {
    symbol: 'Ft',
    code: 'HUF',
    name: 'Hungarian Forint',
    namePlural: 'Hungarian forints',
  },
  IDR: {
    symbol: 'Rp',
    code: 'IDR',
    name: 'Indonesian Rupiah',
    namePlural: 'Indonesian rupiahs',
  },
  ILS: {
    symbol: '₪',
    code: 'ILS',
    name: 'Israeli New Sheqel',
    namePlural: 'Israeli new sheqels',
  },
  INR: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
    namePlural: 'Indian rupees',
  },
  IQD: {
    symbol: 'IQD',
    code: 'IQD',
    name: 'Iraqi Dinar',
    namePlural: 'Iraqi dinars',
  },
  IRR: {
    symbol: 'IRR',
    code: 'IRR',
    name: 'Iranian Rial',
    namePlural: 'Iranian rials',
  },
  ISK: {
    symbol: 'Ikr',
    code: 'ISK',
    name: 'Icelandic Króna',
    namePlural: 'Icelandic krónur',
  },
  JMD: {
    symbol: 'J$',
    code: 'JMD',
    name: 'Jamaican Dollar',
    namePlural: 'Jamaican dollars',
  },
  JOD: {
    symbol: 'JD',
    code: 'JOD',
    name: 'Jordanian Dinar',
    namePlural: 'Jordanian dinars',
  },
  JPY: {
    symbol: '¥',
    code: 'JPY',
    name: 'Japanese Yen',
    namePlural: 'Japanese yen',
  },
  KES: {
    symbol: 'Ksh',
    code: 'KES',
    name: 'Kenyan Shilling',
    namePlural: 'Kenyan shillings',
  },
  KHR: {
    symbol: 'KHR',
    code: 'KHR',
    name: 'Cambodian Riel',
    namePlural: 'Cambodian riels',
  },
  KMF: {
    symbol: 'CF',
    code: 'KMF',
    name: 'Comorian Franc',
    namePlural: 'Comorian francs',
  },
  KRW: {
    symbol: '₩',
    code: 'KRW',
    name: 'South Korean Won',
    namePlural: 'South Korean won',
  },
  KWD: {
    symbol: 'KD',
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    namePlural: 'Kuwaiti dinars',
  },
  KZT: {
    symbol: 'KZT',
    code: 'KZT',
    name: 'Kazakhstani Tenge',
    namePlural: 'Kazakhstani tenges',
  },
  LBP: {
    symbol: 'L.L.',
    code: 'LBP',
    name: 'Lebanese Pound',
    namePlural: 'Lebanese pounds',
  },
  LKR: {
    symbol: 'SLRs',
    code: 'LKR',
    name: 'Sri Lankan Rupee',
    namePlural: 'Sri Lankan rupees',
  },
  LTL: {
    symbol: 'Lt',
    code: 'LTL',
    name: 'Lithuanian Litas',
    namePlural: 'Lithuanian litai',
  },
  LVL: {
    symbol: 'Ls',
    code: 'LVL',
    name: 'Latvian Lats',
    namePlural: 'Latvian lati',
  },
  LYD: {
    symbol: 'LD',
    code: 'LYD',
    name: 'Libyan Dinar',
    namePlural: 'Libyan dinars',
  },
  MAD: {
    symbol: 'MAD',
    code: 'MAD',
    name: 'Moroccan Dirham',
    namePlural: 'Moroccan dirhams',
  },
  MDL: {
    symbol: 'MDL',
    code: 'MDL',
    name: 'Moldovan Leu',
    namePlural: 'Moldovan lei',
  },
  MGA: {
    symbol: 'MGA',
    code: 'MGA',
    name: 'Malagasy Ariary',
    namePlural: 'Malagasy Ariaries',
  },
  MKD: {
    symbol: 'MKD',
    code: 'MKD',
    name: 'Macedonian Denar',
    namePlural: 'Macedonian denari',
  },
  MMK: {
    symbol: 'MMK',
    code: 'MMK',
    name: 'Myanma Kyat',
    namePlural: 'Myanma kyats',
  },
  MOP: {
    symbol: 'MOP$',
    code: 'MOP',
    name: 'Macanese Pataca',
    namePlural: 'Macanese patacas',
  },
  MUR: {
    symbol: 'MURs',
    code: 'MUR',
    name: 'Mauritian Rupee',
    namePlural: 'Mauritian rupees',
  },
  MXN: {
    symbol: 'MX$',
    code: 'MXN',
    name: 'Mexican Peso',
    namePlural: 'Mexican pesos',
  },
  MYR: {
    symbol: 'RM',
    code: 'MYR',
    name: 'Malaysian Ringgit',
    namePlural: 'Malaysian ringgits',
  },
  MZN: {
    symbol: 'MTn',
    code: 'MZN',
    name: 'Mozambican Metical',
    namePlural: 'Mozambican meticals',
  },
  NAD: {
    symbol: 'N$',
    code: 'NAD',
    name: 'Namibian Dollar',
    namePlural: 'Namibian dollars',
  },
  NGN: {
    symbol: '₦',
    code: 'NGN',
    name: 'Nigerian Naira',
    namePlural: 'Nigerian nairas',
  },
  NIO: {
    symbol: 'C$',
    code: 'NIO',
    name: 'Nicaraguan Córdoba',
    namePlural: 'Nicaraguan córdobas',
  },
  NOK: {
    symbol: 'Nkr',
    code: 'NOK',
    name: 'Norwegian Krone',
    namePlural: 'Norwegian kroner',
  },
  NPR: {
    symbol: 'NPRs',
    code: 'NPR',
    name: 'Nepalese Rupee',
    namePlural: 'Nepalese rupees',
  },
  NZD: {
    symbol: 'NZ$',
    code: 'NZD',
    name: 'New Zealand Dollar',
    namePlural: 'New Zealand dollars',
  },
  OMR: {
    symbol: 'OMR',
    code: 'OMR',
    name: 'Omani Rial',
    namePlural: 'Omani rials',
  },
  PAB: {
    symbol: 'B/.',
    code: 'PAB',
    name: 'Panamanian Balboa',
    namePlural: 'Panamanian balboas',
  },
  PEN: {
    symbol: 'S/.',
    code: 'PEN',
    name: 'Peruvian Nuevo Sol',
    namePlural: 'Peruvian nuevos soles',
  },
  PHP: {
    symbol: '₱',
    code: 'PHP',
    name: 'Philippine Peso',
    namePlural: 'Philippine pesos',
  },
  PKR: {
    symbol: 'PKRs',
    code: 'PKR',
    name: 'Pakistani Rupee',
    namePlural: 'Pakistani rupees',
  },
  PLN: {
    symbol: 'zł',
    code: 'PLN',
    name: 'Polish Zloty',
    namePlural: 'Polish zlotys',
  },
  PYG: {
    symbol: '₲',
    code: 'PYG',
    name: 'Paraguayan Guarani',
    namePlural: 'Paraguayan guaranis',
  },
  QAR: {
    symbol: 'QR',
    code: 'QAR',
    name: 'Qatari Rial',
    namePlural: 'Qatari rials',
  },
  RON: {
    symbol: 'RON',
    code: 'RON',
    name: 'Romanian Leu',
    namePlural: 'Romanian lei',
  },
  RSD: {
    symbol: 'din.',
    code: 'RSD',
    name: 'Serbian Dinar',
    namePlural: 'Serbian dinars',
  },
  RUB: {
    symbol: 'RUB',
    code: 'RUB',
    name: 'Russian Ruble',
    namePlural: 'Russian rubles',
  },
  RWF: {
    symbol: 'RWF',
    code: 'RWF',
    name: 'Rwandan Franc',
    namePlural: 'Rwandan francs',
  },
  SAR: {
    symbol: 'SR',
    code: 'SAR',
    name: 'Saudi Riyal',
    namePlural: 'Saudi riyals',
  },
  SDG: {
    symbol: 'SDG',
    code: 'SDG',
    name: 'Sudanese Pound',
    namePlural: 'Sudanese pounds',
  },
  SEK: {
    symbol: 'Skr',
    code: 'SEK',
    name: 'Swedish Krona',
    namePlural: 'Swedish kronor',
  },
  SGD: {
    symbol: 'S$',
    code: 'SGD',
    name: 'Singapore Dollar',
    namePlural: 'Singapore dollars',
  },
  SOS: {
    symbol: 'Ssh',
    code: 'SOS',
    name: 'Somali Shilling',
    namePlural: 'Somali shillings',
  },
  SYP: {
    symbol: 'SY£',
    code: 'SYP',
    name: 'Syrian Pound',
    namePlural: 'Syrian pounds',
  },
  THB: { symbol: '฿', code: 'THB', name: 'Thai Baht', namePlural: 'Thai baht' },
  TND: {
    symbol: 'DT',
    code: 'TND',
    name: 'Tunisian Dinar',
    namePlural: 'Tunisian dinars',
  },
  TOP: {
    symbol: 'T$',
    code: 'TOP',
    name: 'Tongan Paʻanga',
    namePlural: 'Tongan paʻanga',
  },
  TRY: {
    symbol: 'TL',
    code: 'TRY',
    name: 'Turkish Lira',
    namePlural: 'Turkish Lira',
  },
  TTD: {
    symbol: 'TT$',
    code: 'TTD',
    name: 'Trinidad and Tobago Dollar',
    namePlural: 'Trinidad and Tobago dollars',
  },
  TWD: {
    symbol: 'NT$',
    code: 'TWD',
    name: 'New Taiwan Dollar',
    namePlural: 'New Taiwan dollars',
  },
  TZS: {
    symbol: 'TSh',
    code: 'TZS',
    name: 'Tanzanian Shilling',
    namePlural: 'Tanzanian shillings',
  },
  UAH: {
    symbol: '₴',
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    namePlural: 'Ukrainian hryvnias',
  },
  UGX: {
    symbol: 'USh',
    code: 'UGX',
    name: 'Ugandan Shilling',
    namePlural: 'Ugandan shillings',
  },
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    namePlural: 'US dollars',
  },
  UYU: {
    symbol: '$U',
    code: 'UYU',
    name: 'Uruguayan Peso',
    namePlural: 'Uruguayan pesos',
  },
  UZS: {
    symbol: 'UZS',
    code: 'UZS',
    name: 'Uzbekistan Som',
    namePlural: 'Uzbekistan som',
  },
  VEF: {
    symbol: 'Bs.F.',
    code: 'VEF',
    name: 'Venezuelan Bolívar',
    namePlural: 'Venezuelan bolívars',
  },
  VND: {
    symbol: '₫',
    code: 'VND',
    name: 'Vietnamese Dong',
    namePlural: 'Vietnamese dong',
  },
  XAF: {
    symbol: 'FCFA',
    code: 'XAF',
    name: 'CFA Franc BEAC',
    namePlural: 'CFA francs BEAC',
  },
  XCD: {
    symbol: 'EC$',
    code: 'XCD',
    name: 'Eastern Caribbean dollar',
    namePlural: 'Eastern Caribbean dollars',
  },
  XOF: {
    symbol: 'CFA',
    code: 'XOF',
    name: 'CFA Franc BCEAO',
    namePlural: 'CFA francs BCEAO',
  },
  YER: {
    symbol: 'YR',
    code: 'YER',
    name: 'Yemeni Rial',
    namePlural: 'Yemeni rials',
  },
  ZAR: {
    symbol: 'R',
    code: 'ZAR',
    name: 'South African Rand',
    namePlural: 'South African rand',
  },
  ZMK: {
    symbol: 'ZK',
    code: 'ZMK',
    name: 'Zambian Kwacha',
    namePlural: 'Zambian kwachas',
  },
  ZWL: {
    symbol: 'ZWL$',
    code: 'ZWL',
    name: 'Zimbabwean Dollar',
    namePlural: 'Zimbabwean Dollar',
  },
}

// https://apilayer.com/marketplace/exchangerates_data-api
export const EXCHANGE_RATES_API_URL =
  'https://api.apilayer.com/exchangerates_data/timeseries'

export const ITEM_LEVEL_CONVERSION_TAG = 'convert:'
