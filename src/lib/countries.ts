export type Region =
  'home' | 'middle-east' | 'africa' | 'asia' | 'latin-america' | 'europe'

export const regionNames: Record<Region, string> = {
  home: 'Home',
  'middle-east': 'Middle East & Caucasus',
  africa: 'Africa',
  asia: 'Asia',
  'latin-america': 'Latin America',
  europe: 'Europe',
}

const countries = {
  Belgium: { code: 'BE', region: 'europe' },
  'Bosnia and Herzegovina': { code: 'BA', region: 'europe' },
  Cambodia: { code: 'KH', region: 'asia' },
  China: { code: 'CN', region: 'asia' },
  'Costa Rica': { code: 'CR', region: 'latin-america' },
  'El Salvador': { code: 'SV', region: 'latin-america' },
  France: { code: 'FR', region: 'europe' },
  Georgia: { code: 'GE', region: 'middle-east' },
  Guatemala: { code: 'GT', region: 'latin-america' },
  Indonesia: { code: 'ID', region: 'asia' },
  Israel: { code: 'IL', region: 'middle-east' },
  Italy: { code: 'IT', region: 'europe' },
  Japan: { code: 'JP', region: 'asia' },
  Kenya: { code: 'KE', region: 'africa' },
  Laos: { code: 'LA', region: 'asia' },
  Montenegro: { code: 'ME', region: 'europe' },
  Nepal: { code: 'NP', region: 'asia' },
  Netherlands: { code: 'NL', region: 'europe' },
  Panama: { code: 'PA', region: 'latin-america' },
  Philippines: { code: 'PH', region: 'asia' },
  Portugal: { code: 'PT', region: 'europe' },
  Rwanda: { code: 'RW', region: 'africa' },
  Serbia: { code: 'RS', region: 'europe' },
  Singapore: { code: 'SG', region: 'asia' },
  Switzerland: { code: 'CH', region: 'europe' },
  Tanzania: { code: 'TZ', region: 'africa' },
  Thailand: { code: 'TH', region: 'asia' },
  UAE: { code: 'AE', region: 'middle-east' },
  USA: { code: 'US', region: 'home' },
  Vietnam: { code: 'VN', region: 'asia' },
} as const satisfies Record<string, { code: string; region: Region }>

export type CountryName = keyof typeof countries
export type CountryCode = (typeof countries)[CountryName]['code']
export type Country = {
  name: CountryName
  code: CountryCode
  region: Region
}

const countryAliases: Record<string, CountryName> = {
  'United States': 'USA',
}

export function getCountry(name?: string): Country | undefined {
  if (!name) return undefined

  const canonical = countryAliases[name] ?? name
  if (!(canonical in countries)) return undefined
  const country = countries[canonical as CountryName]
  return { name: canonical as CountryName, ...country }
}

export function getCountryCode(name?: string): CountryCode | undefined {
  return getCountry(name)?.code
}
