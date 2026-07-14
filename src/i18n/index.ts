import { ru } from "./locales/ru"
import { uk } from "./locales/uk"

export type { AppStrings } from "./types"

export const LOCALES = {
  ru,
  uk,
} as const

export type Locale = keyof typeof LOCALES

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Русский",
  uk: "Українська",
}

export const DEFAULT_LOCALE: Locale = "ru"
