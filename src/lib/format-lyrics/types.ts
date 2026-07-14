import type { OutputLanguage } from "./output-language"

export type { OutputLanguage } from "./output-language"

export interface FormatOptions {
  capitalizeSlides: boolean
  removePunctuation: boolean
  removeLinks: boolean
  outputLanguage: OutputLanguage
}

export interface FormatSlide {
  // Canonical (English) group name, e.g. "Verse 2" — used to look up the
  // slide's preview color, which is keyed on the canonical name regardless
  // of output language.
  header: string | null
  // The header translated into the selected output language, e.g. "Куплет
  // 2" — what's actually shown to the user.
  headerLabel: string | null
  lines: string[]
  isTitle: boolean
}

export interface FormatResult {
  output: string
  slideCount: number
  sections: string[]
  slides: FormatSlide[]
}
