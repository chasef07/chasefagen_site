import { describe, expect, test } from 'bun:test'

import {
  countryPages,
  currentJourneyStop,
  getCountryPage,
  journeyRoute,
  journeyStopKey,
  type JourneyStop,
} from './world-journey'

const expectedCountrySlugs: NonNullable<JourneyStop['countrySlug']>[] = [
  'israel',
  'georgia',
  'kenya',
  'tanzania',
  'rwanda',
  'uae',
  'nepal',
  'thailand',
  'laos',
  'cambodia',
  'china',
  'vietnam',
  'singapore',
  'philippines',
  'indonesia',
  'japan',
  'costa-rica',
  'panama',
  'guatemala',
  'el-salvador',
  'netherlands',
  'belgium',
  'portugal',
  'italy',
  'switzerland',
  'montenegro',
  'bosnia-and-herzegovina',
  'serbia',
]

const expectedRoute: [string, readonly [number, number]][] = [
  ['Israel', [31.7683, 35.2137]],
  ['Georgia', [42.3154, 43.3569]],
  ['Kenya', [-1.2921, 36.8219]],
  ['Tanzania', [-6.369, 34.8888]],
  ['Rwanda', [-1.9403, 29.8739]],
  ['UAE', [25.2048, 55.2708]],
  ['Nepal', [27.7172, 85.324]],
  ['Thailand', [15.87, 100.9925]],
  ['Laos', [19.8563, 102.4955]],
  ['Cambodia', [12.5657, 104.991]],
  ['China', [30.5728, 104.0668]],
  ['Vietnam', [14.0583, 108.2772]],
  ['Singapore', [1.3521, 103.8198]],
  ['Philippines', [12.8797, 121.774]],
  ['Indonesia', [-8.4095, 115.1889]],
  ['Japan', [43.0642, 141.3469]],
  ['Florida, USA', [27.9659, -82.8001]],
  ['Costa Rica', [9.7489, -83.7534]],
  ['Panama', [8.9824, -79.5199]],
  ['Guatemala', [14.6349, -90.5069]],
  ['El Salvador', [13.4933, -89.3833]],
  ['Netherlands', [51.9244, 4.4777]],
  ['Belgium', [51.0543, 3.7174]],
  ['Ericeira, Portugal', [38.9627, -9.4156]],
  ['Milan, Italy', [45.4642, 9.19]],
  ['Interlaken, Switzerland', [46.6863, 7.8632]],
  ['Kotor, Montenegro', [42.4247, 18.7712]],
  ['Mostar, Bosnia and Herzegovina', [43.3438, 17.8078]],
  ['Belgrade, Serbia', [44.7866, 20.4489]],
  ['New York, USA', [40.7128, -74.006]],
  ['Palm Harbor, Florida, USA', [28.0781, -82.7637]],
  ['San Francisco, California, USA', [37.7749, -122.4194]],
  ['Clearwater, Florida, USA', [27.9659, -82.8001]],
]

describe('World journey interface', () => {
  test('preserves the country-page index and route order', () => {
    const stopKeys = journeyRoute.map(journeyStopKey)

    expect(new Set(stopKeys).size).toBe(stopKeys.length)
    expect(countryPages.map((country) => country.slug)).toEqual(
      expectedCountrySlugs,
    )
    expect(
      journeyRoute.map(
        (stop) =>
          [
            stop.stopName ? `${stop.stopName}, ${stop.name}` : stop.name,
            stop.coordinates,
          ] as const,
      ),
    ).toEqual(expectedRoute)
  })

  test('derives journey country facts from their country pages', () => {
    const countrySlugs = [
      ...new Set(
        journeyRoute.flatMap((stop) =>
          stop.countrySlug ? [stop.countrySlug] : [],
        ),
      ),
    ]

    expect(countrySlugs).toEqual(expectedCountrySlugs)
    for (const stop of journeyRoute) {
      if (!stop.countrySlug) continue
      expect(getCountryPage(stop.countrySlug)?.name).toBe(stop.name)
    }
  })

  test('uses the final route stop as the current location', () => {
    expect(currentJourneyStop).toMatchObject({
      name: 'Clearwater, Florida, USA',
      coordinates: [27.9659, -82.8001],
      visitDate: 'October 2026',
    })
  })

  test('keeps US locations as journey-only stops', () => {
    const journeyOnlyStops = journeyRoute.filter((stop) => !stop.countrySlug)

    expect(journeyOnlyStops.map((stop) => stop.name)).toEqual([
      'Florida, USA',
      'New York, USA',
      'Palm Harbor, Florida, USA',
      'San Francisco, California, USA',
      'Clearwater, Florida, USA',
    ])
    for (const stop of journeyOnlyStops) {
      expect(countryPages.some((country) => country.name === stop.name)).toBe(
        false,
      )
    }
  })
})
