import type { BlogPost } from '../types/blog'

import { september2024Posts } from './blog-posts/2024-september'
import { october2024Posts } from './blog-posts/2024-october'
import { november2024Posts } from './blog-posts/2024-november'
import { december2024Posts } from './blog-posts/2024-december'
import { january2025Posts } from './blog-posts/2025-january'
import { february2025Posts } from './blog-posts/2025-february'
import { march2025Posts } from './blog-posts/2025-march'
import { april2025Posts } from './blog-posts/2025-april'
import { may2025Posts } from './blog-posts/2025-may'
import { june2025Posts } from './blog-posts/2025-june'
import { july2025Posts } from './blog-posts/2025-july'
import { august2025Posts } from './blog-posts/2025-august'
import { october2025Posts } from './blog-posts/2025-october'
import { november2025Posts } from './blog-posts/2025-november'
import { december2025Posts } from './blog-posts/2025-december'
import { january2026Posts } from './blog-posts/2026-january'
import { february2026Posts } from './blog-posts/2026-february'
import { march2026Posts } from './blog-posts/2026-march'
import { april2026Posts } from './blog-posts/2026-april'
import { may2026Posts } from './blog-posts/2026-may'
import { june2026Posts } from './blog-posts/2026-june'
import { july2026Posts } from './blog-posts/2026-july'
import { august2026Posts } from './blog-posts/2026-august'
import { september2026Posts } from './blog-posts/2026-september'
import { october2026Posts } from './blog-posts/2026-october'

export type BlogArchive = {
  year: number
  slug: string
  title: string
  date: string
  displayDate: string
  excerpt: string
  image: string
  imageFit?: 'cover' | 'contain'
  imagePosition?: string
}

export const allBlogPosts: BlogPost[] = [
  ...september2024Posts,
  ...october2024Posts,
  ...november2024Posts,
  ...december2024Posts,
  ...january2025Posts,
  ...february2025Posts,
  ...march2025Posts,
  ...april2025Posts,
  ...may2025Posts,
  ...june2025Posts,
  ...july2025Posts,
  ...august2025Posts,
  ...october2025Posts,
  ...november2025Posts,
  ...december2025Posts,
  ...january2026Posts,
  ...february2026Posts,
  ...march2026Posts,
  ...april2026Posts,
  ...may2026Posts,
  ...june2026Posts,
  ...july2026Posts,
  ...august2026Posts,
  ...september2026Posts,
  ...october2026Posts,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const blogArchives: BlogArchive[] = [
  {
    year: 2026,
    slug: 'october',
    title: 'October 2026: Back Home in Florida',
    date: '2026-10-12',
    displayDate: 'October 2026',
    excerpt:
      "Back home in Clearwater, reflecting on freedom, family, almost a year of building with Kyle, and where to invest in my life's work.",
    image: '/assets/images/misc/posttrip.jpg',
  },
  {
    year: 2026,
    slug: 'september',
    title: 'September 2026: San Francisco',
    date: '2026-09-01',
    displayDate: 'September 2026',
    excerpt:
      'Five days into a month in San Francisco, finding momentum among builders, founders, surf, and the pulse of the tech capital of the world.',
    image: '/assets/images/blog/2026/september/chase-kyle-acuity-health.jpg',
    imagePosition: 'center 35%',
  },
  {
    year: 2026,
    slug: 'august',
    title: 'August 2026: Switzerland to Florida',
    date: '2026-08-01',
    displayDate: 'August 2026',
    excerpt:
      'From long days hiking through the Swiss Alps to the Balkans and a grounded return home to Florida.',
    image: '/assets/images/blog/2026/august/mostar-old-bridge.jpg',
    imagePosition: 'center 72%',
  },
  {
    year: 2026,
    slug: 'july',
    title: 'July 2026: European Living in Ericeira',
    date: '2026-07-26',
    displayDate: 'July 2026',
    excerpt:
      'Closing out two and a half months in Portugal with reflections on freedom, agency, and how much can change in a year.',
    image: '/assets/images/blog/2026/june/work-surf-portugal.webp',
    imagePosition: 'center 70%',
  },
  {
    year: 2026,
    slug: 'june',
    title: 'June 2026: Work + Surf in Portugal',
    date: '2026-06-21',
    displayDate: 'June 2026',
    excerpt:
      'Deep work, daily surf, and settling into the rhythm of building from Ericeira.',
    image: '/assets/images/blog/2026/june/work-surf-portugal.webp',
    imagePosition: 'center 70%',
  },
  {
    year: 2026,
    slug: 'may',
    title: 'May 2026: Europe and Ericeira',
    date: '2026-05-29',
    displayDate: 'May 2026',
    excerpt:
      'Netherlands, Belgium, and landing in Ericeira to surf, work, and keep building.',
    image: '/assets/images/blog/2026/may/may-2026.webp',
    imagePosition: 'center 52%',
  },
  {
    year: 2026,
    slug: 'april',
    title: 'April 2026: Turning 26',
    date: '2026-04-01',
    displayDate: 'April 2026',
    excerpt:
      'Turning 26, visiting San Diego, and reflecting on friendship, freedom, and the life I want to build.',
    image: '/assets/images/misc/fagenboyz.jpg',
  },
  {
    year: 2026,
    slug: 'march',
    title: 'March 2026: United States, Working Hard',
    date: '2026-03-01',
    displayDate: 'March 2026',
    excerpt:
      'Back home in Florida deploying AI agents, attending conferences, and chasing deals in New Jersey.',
    image: '/assets/images/misc/rays-game.jpg',
    imagePosition: 'center 24%',
  },
  {
    year: 2026,
    slug: 'february',
    title: 'February 2026: Santa Teresa, Surfing and Building',
    date: '2026-02-01',
    displayDate: 'February 2026',
    excerpt:
      'A new month in Santa Teresa focused on deep work, consistent surfing, and building the next chapter.',
    image: '/assets/images/misc/santateresa-boys.jpg',
  },
  {
    year: 2026,
    slug: 'january',
    title: 'January 2026: Exploring El Salvador',
    date: '2026-01-07',
    displayDate: 'January 2026',
    excerpt:
      "Leaving Guatemala for El Salvador's surf coast, a chance encounter with a pastor, and thoughts on government and infrastructure.",
    image: '/assets/images/misc/elsalvador-surfcity.jpg',
  },
  {
    year: 2025,
    slug: 'december',
    title: 'December 2025: Guatemala Galavanting',
    date: '2025-12-17',
    displayDate: 'December 2025',
    excerpt:
      'Arriving in Guatemala after Hanukkah with family - one last backpacking adventure before starting a new section of life.',
    image: '/assets/images/blog/2025/december/guatflag.jpg',
  },
  {
    year: 2025,
    slug: 'november',
    title: 'November 2025: Arriving in Panama',
    date: '2025-11-02',
    displayDate: 'November 2025',
    excerpt:
      'First impressions of Bocas del Toro, Panama - exploring viber cafes, cultural authenticity, and what makes a place feel like home.',
    image: '/assets/images/misc/panama-dive.jpg',
  },
  {
    year: 2025,
    slug: 'october',
    title: 'October 2025: Business in Costa Rica',
    date: '2025-10-09',
    displayDate: 'October 2025',
    excerpt:
      'On the eve of a one-way flight, reflecting on family, AI consulting with Kyle, and committing to ship real value in Costa Rica.',
    image: '/assets/images/misc/costa-business.jpg',
  },
  {
    year: 2025,
    slug: 'august',
    title: 'August 2025: Coming Home to Florida',
    date: '2025-08-02',
    displayDate: 'August 2025',
    excerpt:
      "Reverse culture shock and finding home again after a year of global adventures. Reflections on returning to Florida and what 'home' means now.",
    image: '/assets/images/misc/posttrip.jpg',
  },
  {
    year: 2025,
    slug: 'july',
    title: 'July 2025: Hokkaido, the Northern Gem of Japan',
    date: '2025-07-01',
    displayDate: 'July 2025',
    excerpt: 'Hokkaido cuisine, nature, and culture',
    image: '/assets/images/food/sush.jpg',
  },
  {
    year: 2025,
    slug: 'june',
    title: 'June 2025: Indonesia',
    date: '2025-06-01',
    displayDate: 'June 2025',
    excerpt:
      'From surfing worldclass waves to temple-hopping in Bali, Indonesia is a whirlwind of ancient culture, amazing wildlife, and adventure.',
    image: '/assets/images/misc/indoprof.jpg',
  },
  {
    year: 2025,
    slug: 'may',
    title: 'May 2025: Island Hopping in the Philippines',
    date: '2025-05-01',
    displayDate: 'May 2025',
    excerpt:
      'Turquoise waterfalls, epic snorkeling, crazy surfing, and laid-back beach vibes — the Philippines hits hard in every direction.',
    image: '/assets/images/misc/canyoneering.jpg',
  },
  {
    year: 2025,
    slug: 'april',
    title: 'April 2025: Motorbiking Vietnam',
    date: '2025-04-01',
    displayDate: 'April 2025',
    excerpt:
      'Ride with me across terraced rice fields while enjoying traditional Vietnamese cuisine.',
    image: '/assets/images/misc/droneshotrice.jpg',
  },
  {
    year: 2025,
    slug: 'march',
    title: 'March 2025: Chilling in Cambodia',
    date: '2025-03-01',
    displayDate: 'March 2025',
    excerpt:
      'From the ancient temples of Angkor Wat to the pristine beaches of Koh Rong, exploring the wonders of Cambodia.',
    image: '/assets/images/misc/kohsdach.jpg',
  },
  {
    year: 2025,
    slug: 'february',
    title: 'February 2025: Adventures in Laos',
    date: '2025-02-01',
    displayDate: 'February 2025',
    excerpt:
      "Journeying through Laos' traditional villages and beautiful landscapes, discovering the heart of Southeast Asia.",
    image: '/assets/images/misc/laosfall-2.jpg',
  },
  {
    year: 2025,
    slug: 'january',
    title: 'January 2025: Thailand Discos',
    date: '2025-01-01',
    displayDate: 'January 2025',
    excerpt:
      'From island parties to serene sunsets, experiencing the allure of Thailand.',
    image: '/assets/images/misc/fullmoon-2.jpg',
  },
  {
    year: 2024,
    slug: 'december',
    title: 'December 2024: Trekking in Nepal',
    date: '2024-12-01',
    displayDate: 'December 2024',
    excerpt:
      'Exploring the majestic Himalayas and vibrant streets of Kathmandu. From ancient temples to mountain adventures.',
    image: '/assets/images/misc/namaste8-2.jpg',
  },
  {
    year: 2024,
    slug: 'november',
    title: 'November 2024: Safaris of East Africa',
    date: '2024-11-01',
    displayDate: 'November 2024',
    excerpt:
      'From the vast savannas of Tanzania to the perfectious coffee of Rwanda.',
    image: '/assets/images/misc/serengeti-2.jpg',
  },
  {
    year: 2024,
    slug: 'october',
    title: 'October 2024: Investing in Georgia',
    date: '2024-10-01',
    displayDate: 'October 2024',
    excerpt:
      'Discovering the rich culture and ancient traditions of Georgia, from the vibrant streets of Tbilisi to the stunning mountains of Gudauri.',
    image: '/assets/images/misc/blarg-2.jpg',
  },
  {
    year: 2024,
    slug: 'september',
    title: 'September 2024: Connecting in Israel',
    date: '2024-09-01',
    displayDate: 'September 2024',
    excerpt:
      'The start of my world adventure, from the final days in Florida to the first experiences in Israel.',
    image: '/assets/images/misc/holyholy.jpg',
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
