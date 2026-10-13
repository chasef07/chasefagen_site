export interface CountryPage {
  name: string
  slug: string
  description: string
  highlights: string[]
}

type CountryPageDetails = Omit<CountryPage, 'slug'>

const countryPageDetailsBySlug = {
  israel: {
    name: 'Israel',
    description:
      'Gaza border farming, Jerusalem holidays, Tel Aviv, and the first month on the road.',
    highlights: [
      'Jerusalem',
      'Tel Aviv',
      'Gaza Border Farming',
      'Sukkot Celebration',
    ],
  },
  georgia: {
    name: 'Georgia',
    description:
      'Tbilisi, wine country, Prometheus Cave, and the Gudauri apartment bet.',
    highlights: ['Tbilisi', 'Georgian Wine', 'Mountain Monasteries'],
  },
  kenya: {
    name: 'Kenya',
    description:
      'Nairobi, Diani Beach, kite surfing, and the first real taste of East Africa.',
    highlights: ['Nairobi', 'Safari', 'Maasai Culture'],
  },
  tanzania: {
    name: 'Tanzania',
    description:
      'Serengeti safari, Ngorongoro, Tarangire, and hunting at dawn with the Hadza.',
    highlights: ['Zanzibar', 'Serengeti', 'Stone Town'],
  },
  rwanda: {
    name: 'Rwanda',
    description:
      'Kigali, Kivu Noir coffee, the genocide memorial, and meetings about business in Africa.',
    highlights: ['Kigali', 'Gorilla Trekking', 'Genocide Memorial'],
  },
  uae: {
    name: 'UAE',
    description:
      'Dubai layover, Burj Khalifa, Ski Dubai, and the consumption capital between trip legs.',
    highlights: ['Dubai', 'Abu Dhabi', 'Desert Safari'],
  },
  nepal: {
    name: 'Nepal',
    description:
      'Annapurna Circuit, Thorong La Pass, Kathmandu, Pokhara, and Himalayan pressure testing.',
    highlights: [
      'Annapurna Circuit',
      'Kathmandu',
      'Pokhara',
      'Himalayan Views',
    ],
  },
  thailand: {
    name: 'Thailand',
    description:
      'Koh Tao, Full Moon Party, Chiang Dao, Pai, Muay Thai, and the first Southeast Asia stretch.',
    highlights: [
      'Full Moon Party',
      'Muay Thai Training',
      'Chiang Dao',
      'Pai',
      'Koh Tao',
    ],
  },
  laos: {
    name: 'Laos',
    description:
      'Slow boat, Nong Khiaw, Vang Vieng, farm volunteering, and the Thakhek motorbike loop.',
    highlights: [
      'Slow Boat',
      'Luang Prabang',
      'Nong Khiaw',
      'Baci Ceremony',
      'Vang Vieng',
    ],
  },
  cambodia: {
    name: 'Cambodia',
    description:
      'Angkor Wat, Koh Rong, Kampot, Phnom Penh, and the heavier history under the backpacker route.',
    highlights: ['Angkor Wat', 'Siem Reap', 'Phnom Penh', 'Killing Fields'],
  },
  china: {
    name: 'China',
    description:
      'Chengdu pandas, Sichuan food, Zhangjiajie, tea houses, and big-city China.',
    highlights: ['Great Wall', 'Beijing', 'Shanghai'],
  },
  vietnam: {
    name: 'Vietnam',
    description:
      'A 4,000 km motorbike run through Ha Giang, Cao Bang, rice fields, caves, and coastal roads.',
    highlights: ['Hanoi', 'Ho Chi Minh City', 'Ha Long Bay', 'Hoi An'],
  },
  singapore: {
    name: 'Singapore',
    description:
      'Singapore efficiency, hawker food, Little India, and the Dubai comparison.',
    highlights: ['Marina Bay', 'Hawker Centers', 'Gardens by the Bay'],
  },
  philippines: {
    name: 'Philippines',
    description:
      'Siargao surfing, El Nido boats, Port Barton, Cebu waterfalls, and the honest Philippines critique.',
    highlights: ['Palawan', 'Cebu', 'Siargao', 'Island Hopping'],
  },
  indonesia: {
    name: 'Indonesia',
    description:
      'Bali, Uluwatu, Komodo, manta rays, whale sharks, and the business-from-a-laptop question.',
    highlights: ['Bali', 'Komodo', 'Yogyakarta', 'Raja Ampat'],
  },
  japan: {
    name: 'Japan',
    description:
      'Hokkaido, onsens, Sapporo, Japanese food, and a slower post-Asia reflection period.',
    highlights: ['Tokyo', 'Kyoto', 'Osaka', 'Mount Fuji'],
  },
  'costa-rica': {
    name: 'Costa Rica',
    description:
      'Puerto Viejo, Nosara, Santa Teresa, surf-town scoring, and building from Costa Rica.',
    highlights: ['Manuel Antonio', 'Monteverde', 'Surf Towns'],
  },
  panama: {
    name: 'Panama',
    description:
      'Bocas del Toro, Panama City, canal-country infrastructure, and the Caribbean work stop.',
    highlights: ['Panama City', 'San Blas Islands', 'Bocas del Toro'],
  },
  guatemala: {
    name: 'Guatemala',
    description:
      'Antigua, Lake Atitlan, El Paredon, Mayan cooking, temezcal, and volcano country.',
    highlights: ['Antigua', 'Lake Atitlan', 'Tikal', 'Semuc Champey'],
  },
  'el-salvador': {
    name: 'El Salvador',
    description:
      'El Tunco, Bitcoin Beach, pupusas, clean roads, and the strongest early surf-town score.',
    highlights: ['El Tunco', 'Bitcoin Beach', 'Surf Culture', 'Pupusas'],
  },
  netherlands: {
    name: 'Netherlands',
    description:
      'Rotterdam base, Netherlands flag on the map, and the start of the Euro summer chapter.',
    highlights: ['Rotterdam', 'Euro Summer', 'Dutch Design', 'Cycling Culture'],
  },
  belgium: {
    name: 'Belgium',
    description:
      'Ghent base, Belgium flag on the map, canal streets, and a Euro summer stop.',
    highlights: [
      'Ghent',
      'Euro Summer',
      'Canal Streets',
      'Flemish Architecture',
    ],
  },
  portugal: {
    name: 'Portugal',
    description:
      'Ericeira base, Portugal flag on the map, Atlantic surf, and a defining Euro summer stop.',
    highlights: [
      'Ericeira',
      'Atlantic Surf',
      'Euro Summer',
      'Portuguese Coast',
    ],
  },
  italy: {
    name: 'Italy',
    description:
      'Rome layover, the Colosseum, Trevi Fountain, and a brief first taste of Italy.',
    highlights: ['Rome', 'Colosseum', 'Trevi Fountain', 'Italian Food'],
  },
  switzerland: {
    name: 'Switzerland',
    description:
      'Interlaken base, Swiss Alps, mountain routes, and an Alpine Euro summer stop.',
    highlights: ['Swiss Alps', 'Mountain Towns', 'Euro Summer'],
  },
  montenegro: {
    name: 'Montenegro',
    description:
      'Kotor and Bečići on the Adriatic coast, before crossing into Bosnia and Herzegovina.',
    highlights: ['Kotor', 'Bečići', 'Bay of Kotor', 'Adriatic Coast'],
  },
  'bosnia-and-herzegovina': {
    name: 'Bosnia and Herzegovina',
    description:
      'Mostar base, the Old Bridge, Ottoman-era streets, and a first stop in Bosnia and Herzegovina.',
    highlights: ['Mostar', 'Old Bridge', 'Neretva River', 'Old Town'],
  },
  serbia: {
    name: 'Serbia',
    description:
      'Belgrade base, Serbia flag on the map, and the latest stop on the Balkan route.',
    highlights: ['Belgrade', 'Danube River', 'Sava River', 'Balkan Route'],
  },
} satisfies Record<string, CountryPageDetails>

type CountrySlug = keyof typeof countryPageDetailsBySlug

type JourneyStopDetails = {
  stopName?: string
  coordinates: readonly [number, number]
  visitDate: string
}

type CountryJourneyStop = JourneyStopDetails & {
  name: string
  countrySlug: CountrySlug
}

type JourneyOnlyStop = JourneyStopDetails & {
  name:
    | 'Florida, USA'
    | 'New York, USA'
    | 'Palm Harbor, Florida, USA'
    | 'San Francisco, California, USA'
    | 'Clearwater, Florida, USA'
  countrySlug?: never
}

export type JourneyStop = CountryJourneyStop | JourneyOnlyStop

export function journeyStopKey(stop: JourneyStop): string {
  return `${stop.countrySlug ?? stop.name}:${stop.stopName ?? stop.name}`
}

type ItineraryStop = Omit<CountryJourneyStop, 'name'> | JourneyOnlyStop

const itinerary: readonly ItineraryStop[] = [
  {
    countrySlug: 'israel',
    coordinates: [31.7683, 35.2137],
    visitDate: 'September 2024',
  },
  {
    countrySlug: 'georgia',
    coordinates: [42.3154, 43.3569],
    visitDate: 'October 2024',
  },
  {
    countrySlug: 'kenya',
    coordinates: [-1.2921, 36.8219],
    visitDate: 'November 2024',
  },
  {
    countrySlug: 'tanzania',
    coordinates: [-6.369, 34.8888],
    visitDate: 'November 2024',
  },
  {
    countrySlug: 'rwanda',
    coordinates: [-1.9403, 29.8739],
    visitDate: 'November 2024',
  },
  {
    countrySlug: 'uae',
    coordinates: [25.2048, 55.2708],
    visitDate: 'November 2024',
  },
  {
    countrySlug: 'nepal',
    coordinates: [27.7172, 85.324],
    visitDate: 'December 2024',
  },
  {
    countrySlug: 'thailand',
    coordinates: [15.87, 100.9925],
    visitDate: 'December 2024',
  },
  {
    countrySlug: 'laos',
    coordinates: [19.8563, 102.4955],
    visitDate: 'February 2025',
  },
  {
    countrySlug: 'cambodia',
    coordinates: [12.5657, 104.991],
    visitDate: 'March 2025',
  },
  {
    countrySlug: 'china',
    coordinates: [30.5728, 104.0668],
    visitDate: 'March 2025',
  },
  {
    countrySlug: 'vietnam',
    coordinates: [14.0583, 108.2772],
    visitDate: 'April 2025',
  },
  {
    countrySlug: 'singapore',
    coordinates: [1.3521, 103.8198],
    visitDate: 'May 2025',
  },
  {
    countrySlug: 'philippines',
    coordinates: [12.8797, 121.774],
    visitDate: 'May 2025',
  },
  {
    countrySlug: 'indonesia',
    coordinates: [-8.4095, 115.1889],
    visitDate: 'June 2025',
  },
  {
    countrySlug: 'japan',
    coordinates: [43.0642, 141.3469],
    visitDate: 'July 2025',
  },
  {
    name: 'Florida, USA',
    coordinates: [27.9659, -82.8001],
    visitDate: 'August 2025',
  },
  {
    countrySlug: 'costa-rica',
    coordinates: [9.7489, -83.7534],
    visitDate: 'October 2025',
  },
  {
    countrySlug: 'panama',
    coordinates: [8.9824, -79.5199],
    visitDate: 'November 2025',
  },
  {
    countrySlug: 'guatemala',
    coordinates: [14.6349, -90.5069],
    visitDate: 'December 2025',
  },
  {
    countrySlug: 'el-salvador',
    coordinates: [13.4933, -89.3833],
    visitDate: 'January 2026',
  },
  {
    countrySlug: 'netherlands',
    coordinates: [51.9244, 4.4777],
    visitDate: 'May 2026',
  },
  {
    countrySlug: 'belgium',
    coordinates: [51.0543, 3.7174],
    visitDate: 'May 2026',
  },
  {
    countrySlug: 'portugal',
    stopName: 'Ericeira',
    coordinates: [38.9627, -9.4156],
    visitDate: 'May 2026',
  },
  {
    countrySlug: 'italy',
    stopName: 'Milan',
    coordinates: [45.4642, 9.19],
    visitDate: 'July 2026',
  },
  {
    countrySlug: 'switzerland',
    stopName: 'Interlaken',
    coordinates: [46.6863, 7.8632],
    visitDate: 'August 2026',
  },
  {
    countrySlug: 'montenegro',
    stopName: 'Kotor',
    coordinates: [42.4247, 18.7712],
    visitDate: 'August 2026',
  },
  {
    countrySlug: 'bosnia-and-herzegovina',
    stopName: 'Mostar',
    coordinates: [43.3438, 17.8078],
    visitDate: 'August 2026',
  },
  {
    countrySlug: 'serbia',
    stopName: 'Belgrade',
    coordinates: [44.7866, 20.4489],
    visitDate: 'August 2026',
  },
  {
    name: 'New York, USA',
    coordinates: [40.7128, -74.006],
    visitDate: 'August 2026',
  },
  {
    name: 'Palm Harbor, Florida, USA',
    coordinates: [28.0781, -82.7637],
    visitDate: 'August 2026',
  },
  {
    name: 'San Francisco, California, USA',
    coordinates: [37.7749, -122.4194],
    visitDate: 'September 2026',
  },
  {
    name: 'Clearwater, Florida, USA',
    coordinates: [27.9659, -82.8001],
    visitDate: 'October 2026',
  },
]

export const countryPages: readonly CountryPage[] = Object.entries(
  countryPageDetailsBySlug,
).map(([slug, details]) => ({ slug, ...details }))

const countryPageBySlug = new Map(
  countryPages.map((country) => [country.slug, country]),
)

export function getCountryPage(slug: string): CountryPage | undefined {
  return countryPageBySlug.get(slug)
}

export const journeyRoute: readonly JourneyStop[] = itinerary.map((stop) => {
  if ('name' in stop) return stop

  const country = getCountryPage(stop.countrySlug)
  if (!country) throw new Error(`Unknown country page: ${stop.countrySlug}`)

  return { ...stop, name: country.name }
})

export const currentJourneyStop = journeyRoute.at(-1)!
