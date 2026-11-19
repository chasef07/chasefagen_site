'use client'

import { useEffect, useState } from 'react'

import { parsePackingProgress } from '@/lib/packing-progress'

type PackingItem = {
  label: string
  href?: string
}

const tips = [
  'Keep the main backpack at 40L or less for carry-on.',
  'Use compression cubes to separate pants, shirts, and shorts.',
  'Pack light. Clothes are easy to replace along the way.',
  'Keep electronics and cables together in one organizer.',
]

const categories: Array<{ name: string; items: PackingItem[] }> = [
  {
    name: 'Backpacks & storage',
    items: [
      {
        label: '1 Osprey 40L Farpoint backpack',
        href: 'https://www.osprey.com/farpoint-40-travel-pack-farpont40f22-296',
      },
      {
        label: '1 Osprey 15L daypack',
        href: 'https://www.osprey.com/farpoint-fairview-travel-daypack-farfairdayf22-235',
      },
      {
        label: '2 Eagle Creek compression packing cubes',
        href: 'https://www.eaglecreek.com/products/pack-it-isolate-compression-cube-set-sm',
      },
      {
        label: '1 large Thule clean/dirty packing cube',
        href: 'https://www.thule.com/en-us/organizers/packing-cubes-and-folders/thule-cleandirty-packing-cube-_-3204861',
      },
      { label: '1 small packing cube for the daypack' },
    ],
  },
  {
    name: 'Clothing & footwear',
    items: [
      { label: '7 pairs of underwear' },
      { label: '2 long-sleeve shirts' },
      { label: '2 dri-fit shirts' },
      { label: '3 everyday shirts' },
      { label: '4 pairs of pants' },
      { label: '4 athletic shorts' },
      { label: '8 pairs of socks' },
      { label: '1 bathing suit' },
      { label: '1 bucket hat' },
      { label: '1 quick-dry towel' },
      { label: '1 pair of sandals' },
      { label: '1 pair of Hoka Clifton 9s' },
      { label: '1 pair of OnClouds' },
      { label: '1 windbreaker' },
      { label: '1 pair of sweatpants' },
      { label: '1 pair of sunglasses' },
    ],
  },
  {
    name: 'Electronics',
    items: [
      { label: '1 electronics organizer' },
      { label: '1 wall charger' },
      { label: '1 pair of AirPods Pro' },
      { label: '2 USB-C cables' },
      { label: '2 international wall adapters' },
      {
        label: '1 Anker 24,000 mAh power bank',
        href: 'https://www.anker.com/products/a1379',
      },
      { label: '2 AirTags' },
      { label: '1 MacBook Air and charger' },
      { label: '1 iPhone with magnetic wallet' },
    ],
  },
  {
    name: 'Health & hygiene',
    items: [
      { label: 'Sunscreen' },
      { label: 'Toiletry kit' },
      { label: 'Deodorant' },
      { label: 'Toothbrush and toothpaste' },
      { label: 'Hand sanitizer' },
      { label: 'Floss' },
      { label: 'Nail clippers' },
      { label: 'Prescriptions' },
      {
        label: 'Theragun Mini',
        href: 'https://www.therabody.com/us/en-us/theragun-mini.html',
      },
    ],
  },
  {
    name: 'Personal',
    items: [
      { label: 'Sleeping mask' },
      { label: 'Journal and 2 pens' },
      { label: '2 carabiners' },
      { label: 'Resistance band' },
      { label: 'Passport' },
      { label: 'Yellow fever vaccine exemption' },
    ],
  },
  {
    name: 'Spiritual',
    items: [
      { label: 'Tefillin' },
      { label: 'Kippah' },
      { label: 'Tzitzit' },
      { label: 'Chassidic book' },
    ],
  },
]

const itemIds = categories.flatMap((category, categoryIndex) =>
  category.items.map((_, itemIndex) => `${categoryIndex}-${itemIndex}`),
)
const storageKey = 'packing-checklist-progress'

export function PackingChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [storageError, setStorageError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved !== null) setCheckedItems(parsePackingProgress(saved, itemIds))
    } catch {
      setStorageError(
        'Saved progress could not be loaded. Reset the checklist to start fresh.',
      )
    }
  }, [])

  function updateCheckedItems(next: Set<string>) {
    setCheckedItems(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify([...next]))
      setStorageError(null)
    } catch {
      setStorageError(
        'Progress could not be saved on this device. Changes will be lost when you reload.',
      )
    }
  }

  const toggleItem = (itemId: string) => {
    const next = new Set(checkedItems)
    if (next.has(itemId)) next.delete(itemId)
    else next.add(itemId)
    updateCheckedItems(next)
  }

  const progress = Math.round((checkedItems.size / itemIds.length) * 100)

  return (
    <div className="flex flex-col gap-14">
      <section
        aria-label="Packing progress"
        className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-6"
      >
        <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-3">
          <p className="font-mono text-[13px] tracking-[0.08em] uppercase">
            {checkedItems.size} of {itemIds.length} packed · {progress}%
          </p>
          <div aria-hidden="true" className="h-2 bg-paper-deep">
            <div
              className="h-full bg-accent transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          {storageError && (
            <p role="alert" className="font-mono text-[13px] text-accent">
              {storageError}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm('Clear all checked items?')) return
            updateCheckedItems(new Set())
          }}
          className="min-h-11 border border-ink px-4 font-mono text-[13px] tracking-[0.08em] uppercase hover:bg-ink hover:text-paper"
        >
          Reset
        </button>
      </section>

      <section aria-labelledby="packing-rules" className="flex flex-col gap-5">
        <h2 id="packing-rules" className="font-display text-[34px]">
          Four rules
        </h2>
        <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <li key={tip} className="flex gap-4 text-lg leading-relaxed">
              <span className="font-display text-3xl leading-none text-accent">
                {index + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid items-start gap-x-16 gap-y-12 lg:grid-cols-2">
        {categories.map((category, categoryIndex) => (
          <fieldset key={category.name} className="flex flex-col gap-1">
            <legend className="mb-3 flex w-full items-baseline justify-between border-b border-ink pb-2">
              <span className="font-display text-2xl">{category.name}</span>
              <span className="font-mono text-xs text-ink-soft">
                {category.items.length} items
              </span>
            </legend>
            {category.items.map((item, itemIndex) => {
              const id = `${categoryIndex}-${itemIndex}`
              return (
                <div
                  key={id}
                  className="flex min-h-11 items-center gap-3 border-b border-rule"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={checkedItems.has(id)}
                    onChange={() => toggleItem(id)}
                    className="peer size-4 shrink-0 accent-accent"
                  />
                  <label
                    htmlFor={id}
                    className="flex-1 py-2 text-lg peer-checked:text-ink-soft peer-checked:line-through"
                  >
                    {item.label}
                  </label>
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-ink-soft hover:text-accent"
                    >
                      Link ↗
                    </a>
                  )}
                </div>
              )
            })}
          </fieldset>
        ))}
      </div>
    </div>
  )
}
