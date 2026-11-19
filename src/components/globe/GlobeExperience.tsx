'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import {
  journeyRoute,
  journeyStopKey,
  type JourneyStop,
} from '@/content/world-journey'
import { fetchGeoJSON, type GeoJSON } from '@/utils/geojson-loader'

const GlobeScene = dynamic(() => import('../GlobeScene'), {
  ssr: false,
})

type GlobeStatus = 'loading' | 'retrying' | 'ready' | 'failed'

export default function GlobeExperience() {
  const [selectedCountry, setSelectedCountry] = useState<JourneyStop | null>(
    null,
  )
  const [geoData, setGeoData] = useState<GeoJSON | null>(null)
  const [status, setStatus] = useState<GlobeStatus>('loading')
  const [sceneReady, setSceneReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const load = useCallback(async (retrying = false) => {
    if (retrying) setSceneReady(false)
    setStatus(retrying ? 'retrying' : 'loading')
    try {
      setGeoData(await fetchGeoJSON())
    } catch {
      setStatus('failed')
    }
  }, [])
  const markSceneReady = useCallback(() => setSceneReady(true), [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (geoData && sceneReady) setStatus('ready')
  }, [geoData, sceneReady])

  const guidance = isDesktop
    ? 'Click and drag to explore destinations'
    : 'Tap and drag to explore destinations'
  return (
    <div data-testid="globe-experience" className="flex flex-col gap-3">
      <div className="h-[300px] w-full overflow-hidden border border-rule bg-paper sm:h-[380px] lg:h-[460px] xl:h-[520px]">
        {status === 'failed' ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <p
              data-testid="globe-status"
              role="status"
              className="font-mono text-sm text-ink-soft"
            >
              Globe unavailable. The rest of the journey is still available.
            </p>
            <button
              type="button"
              onClick={() => void load(true)}
              className="min-h-11 border border-ink px-4 font-mono text-[13px] tracking-[0.08em] uppercase hover:bg-ink hover:text-paper"
            >
              Retry globe
            </button>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <GlobeScene
              onSelectCountry={setSelectedCountry}
              selectedCountry={selectedCountry}
              geoData={geoData}
              isMobile={!isDesktop}
              onReady={markSceneReady}
            />
            <span data-testid="globe-status" role="status" className="sr-only">
              {status === 'ready'
                ? 'Ready'
                : status === 'retrying'
                  ? 'Retrying globe'
                  : 'Loading globe'}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 font-mono text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <p data-testid="globe-caption" className="text-ink-soft">
          {selectedCountry
            ? `${selectedCountry.stopName ? `${selectedCountry.stopName}, ` : ''}${selectedCountry.name} · ${selectedCountry.visitDate}`
            : guidance}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Select globe destination"
            value={selectedCountry ? journeyStopKey(selectedCountry) : ''}
            onChange={(event) =>
              setSelectedCountry(
                journeyRoute.find(
                  (country) => journeyStopKey(country) === event.target.value,
                ) ?? null,
              )
            }
            className="min-h-11 max-w-full border border-ink bg-paper px-3"
          >
            <option value="">Choose destination</option>
            {journeyRoute.map((country) => (
              <option
                key={journeyStopKey(country)}
                value={journeyStopKey(country)}
              >
                {country.stopName
                  ? `${country.stopName}, ${country.name}`
                  : country.name}
              </option>
            ))}
          </select>
          {selectedCountry?.countrySlug && (
            <Link
              href={`/countries/${selectedCountry.countrySlug}`}
              className="inline-flex min-h-11 items-center border border-ink px-4 tracking-[0.08em] uppercase hover:bg-ink hover:text-paper"
            >
              Open country →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
