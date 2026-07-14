export interface FormatOptions {
  capitalizeSlides: boolean
  removePunctuation: boolean
  removeLinks: boolean
}

export interface FormatSlide {
  header: string | null
  lines: string[]
  isTitle: boolean
}

export interface FormatResult {
  output: string
  slideCount: number
  sections: string[]
  slides: FormatSlide[]
}
