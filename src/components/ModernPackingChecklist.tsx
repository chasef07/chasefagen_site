'use client'

import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
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

export default function ModernPackingChecklist() {
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
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Packing progress</CardTitle>
          <CardDescription>
            {checkedItems.size} of {itemIds.length} items packed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} aria-label={`${progress}% packed`} />
          {storageError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {storageError}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!window.confirm('Clear all checked items?')) return
              updateCheckedItems(new Set())
            }}
          >
            <RotateCcw data-icon="inline-start" />
            Reset
          </Button>
        </CardFooter>
      </Card>

      <section aria-labelledby="packing-tips" className="flex flex-col gap-4">
        <h2 id="packing-tips" className="text-2xl font-semibold">
          Four rules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <Card key={tip} className="py-5">
              <CardContent className="text-sm text-muted-foreground">
                {tip}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {categories.map((category, categoryIndex) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.items.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldLegend className="sr-only">{category.name}</FieldLegend>
                <FieldGroup data-slot="checkbox-group">
                  {category.items.map((item, itemIndex) => {
                    const id = `${categoryIndex}-${itemIndex}`
                    return (
                      <Field key={id} orientation="horizontal">
                        <Checkbox
                          id={id}
                          checked={checkedItems.has(id)}
                          onCheckedChange={() => toggleItem(id)}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={id}>{item.label}</FieldLabel>
                          {item.href && (
                            <FieldDescription>
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Product link
                              </a>
                            </FieldDescription>
                          )}
                        </FieldContent>
                      </Field>
                    )
                  })}
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
