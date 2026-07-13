export interface AppStrings {
  header: {
    title: string
    tagline: string
    theme: {
      light: string
      dark: string
    }
  }
  options: {
    label: string
    capitalizeSlides: string
    removePunctuation: string
  }
  input: {
    title: string
    clear: string
    clearTooltip: string
    format: string
    formatTooltip: string
    placeholder: string
  }
  output: {
    title: string
    slideCount: string
    copy: string
    copyTooltip: string
    copiedToast: string
    sectionsLabel: string
    sections: string[]
    placeholder: string
  }
  footer: {
    status: string
    formatShortcut: string
    copyShortcut: string
  }
}
