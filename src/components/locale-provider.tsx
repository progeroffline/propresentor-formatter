/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import { DEFAULT_LOCALE, LOCALES, type AppStrings, type Locale } from "@/i18n"

type LocaleProviderProps = {
  children: React.ReactNode
  defaultLocale?: Locale
  storageKey?: string
}

type LocaleProviderState = {
  locale: Locale
  strings: AppStrings
  setLocale: (locale: Locale) => void
}

const LOCALE_VALUES = Object.keys(LOCALES) as Locale[]

const LocaleProviderContext = React.createContext<
  LocaleProviderState | undefined
>(undefined)

function isLocale(value: string | null): value is Locale {
  if (value === null) {
    return false
  }

  return LOCALE_VALUES.includes(value as Locale)
}

export function LocaleProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
  storageKey = "locale",
  ...props
}: LocaleProviderProps) {
  const [locale, setLocaleState] = React.useState<Locale>(() => {
    const storedLocale = localStorage.getItem(storageKey)
    if (isLocale(storedLocale)) {
      return storedLocale
    }

    return defaultLocale
  })

  const setLocale = React.useCallback(
    (nextLocale: Locale) => {
      localStorage.setItem(storageKey, nextLocale)
      setLocaleState(nextLocale)
    },
    [storageKey]
  )

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.key !== storageKey) {
        return
      }

      if (isLocale(event.newValue)) {
        setLocaleState(event.newValue)
        return
      }

      setLocaleState(defaultLocale)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [defaultLocale, storageKey])

  const value = React.useMemo(
    () => ({
      locale,
      strings: LOCALES[locale],
      setLocale,
    }),
    [locale, setLocale]
  )

  return (
    <LocaleProviderContext.Provider {...props} value={value}>
      {children}
    </LocaleProviderContext.Provider>
  )
}

export const useLocale = () => {
  const context = React.useContext(LocaleProviderContext)

  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }

  return context
}
