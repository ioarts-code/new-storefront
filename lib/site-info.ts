export const SITE_URL = 'https://www.ioarts.ink'

export const CONTACT_ADDRESS = {
  streetAddress: 'Loviselundsvägen 27',
  postalCode: '16559',
  addressLocality: 'Hässelby',
  addressCountry: 'SE',
} as const

export const CONTACT_ADDRESS_LINES = [
  CONTACT_ADDRESS.streetAddress,
  `${CONTACT_ADDRESS.postalCode} ${CONTACT_ADDRESS.addressLocality}`,
  'Sweden',
] as const