import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'
import { getCountryCode } from '@/lib/countries'

type CountryFlagProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  country: string
}

export function CountryFlag({
  country,
  className,
  ...props
}: CountryFlagProps) {
  const code = getCountryCode(country)
  if (!code) return null

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn('fi shrink-0', `fi-${code.toLowerCase()}`, className)}
    />
  )
}
