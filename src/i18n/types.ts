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
    removeLinks: string
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
    slideCount: (count: number) => string
    copy: string
    copyTooltip: string
    copiedToast: string
    sectionsLabel: string
    emptyState: string
  }
  footer: {
    status: string
    contactText: string
    contactHandle: string
    contactUrl: string
  }
}
