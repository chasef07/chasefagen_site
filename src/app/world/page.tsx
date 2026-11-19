import Link from 'next/link'

import GlobeExperience from '@/components/globe/GlobeExperience'
import { CountryFlag } from '@/components/journal/CountryFlag'
import { regionFill } from '@/components/journal/region-fill'
import { getPostsForCountry } from '@/content/blog/publication'
import { countryPages, journeyRoute } from '@/content/world-journey'
import { getCountry, regionNames, type Region } from '@/lib/countries'

export const metadata = {
  title: 'World View | Chase Fagen',
  description:
    'Explore Chase Fagen’s travel journal by country and route around the world.',
}

export default function WorldPage() {
  const regions = (Object.keys(regionNames) as Region[])
    .map((region) => ({
      region,
      countries: countryPages.filter(
        (country) => getCountry(country.name)?.region === region,
      ),
    }))
    .filter(({ countries }) => countries.length > 0)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <header className="flex flex-col gap-5 border-b border-rule pt-14 pb-12 sm:pt-20">
        <p className="font-mono text-[13px] tracking-[0.08em] text-ink-soft uppercase">
          {countryPages.length} countries · {journeyRoute.length} stops
        </p>
        <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88] font-light tracking-[-0.035em] italic">
          The world
        </h1>
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">
          Rotate the journey, choose a flag, and drop directly into the stories
          collected there.
        </p>
      </header>

      <div className="flex flex-wrap gap-x-16 gap-y-12 pt-12">
        <section
          aria-label="Journey globe"
          className="min-w-0 flex-[999_1_34rem]"
        >
          <GlobeExperience />
        </section>

        <nav
          aria-label="Countries"
          className="flex min-w-0 flex-[1_1_16rem] flex-col gap-9 font-mono text-[13px]"
        >
          {regions.map(({ region, countries }) => (
            <section key={region} className="flex flex-col gap-3">
              <h2 className="flex items-center gap-2 border-b border-rule pb-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
                <span
                  aria-hidden="true"
                  className={`size-2.5 ${regionFill[region]}`}
                />
                {regionNames[region]}
              </h2>
              <ul className="flex flex-col">
                {countries.map((country) => (
                  <li key={country.slug}>
                    <Link
                      href={`/countries/${country.slug}`}
                      className="flex min-h-9 items-center gap-3 hover:text-accent"
                    >
                      <CountryFlag country={country.name} />
                      <span className="flex-1">{country.name}</span>
                      <span className="text-ink-soft">
                        {getPostsForCountry(country.name).length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </main>
  )
}
