export type OutputLanguage = "en" | "ru" | "uk" | "de"

interface SectionLabelSet {
  en: string
  ru: string
  uk: string
  de: string
}

// The label each canonical group is rendered as in the copied output, per
// output language. Where worship teams commonly use more than one term for
// a group (e.g. Russian "Бридж"/"Мост"), the more universally recognized
// one is used here — the alternates still work for *input* detection via
// group-definitions.ts, they just aren't the chosen *output* spelling.
const SECTION_LABELS: Record<string, SectionLabelSet> = {
  Verse: { en: "Verse", ru: "Куплет", uk: "Куплет", de: "Strophe" },
  Chorus: { en: "Chorus", ru: "Припев", uk: "Приспів", de: "Refrain" },
  Bridge: { en: "Bridge", ru: "Бридж", uk: "Брідж", de: "Bridge" },
  PreChorus: {
    en: "PreChorus",
    ru: "Пред-припев",
    uk: "Передприспів",
    de: "Pre-Chorus",
  },
  Tag: { en: "Tag", ru: "Тег", uk: "Тег", de: "Tag" },
  Intro: { en: "Intro", ru: "Интро", uk: "Інтро", de: "Intro" },
  Ending: { en: "Ending", ru: "Окончание", uk: "Закінчення", de: "Ending" },
  Outro: { en: "Outro", ru: "Концовка", uk: "Аутро", de: "Outro" },
  Interlude: {
    en: "Interlude",
    ru: "Проигрыш",
    uk: "Програш",
    de: "Interlude",
  },
  Vamp: { en: "Vamp", ru: "Вамп", uk: "Вемп", de: "Vamp" },
  Turnaround: {
    en: "Turnaround",
    ru: "Переход",
    uk: "Перехід",
    de: "Turnaround",
  },
  Blank: { en: "Blank", ru: "Пусто", uk: "Порожньо", de: "Leer" },
}

const TITLE_LABELS: SectionLabelSet = {
  en: "Title",
  ru: "Название",
  uk: "Назва",
  de: "Titel",
}

// Section headers carry an optional trailing number ("Verse 2") that must
// survive translation unchanged — only the name itself is looked up.
export function translateSectionHeader(
  canonical: string,
  language: OutputLanguage
): string {
  const numberMatch = canonical.match(/\s+\d+$/)
  const name = numberMatch
    ? canonical.slice(0, -numberMatch[0].length)
    : canonical
  const suffix = numberMatch ? numberMatch[0] : ""

  const labels = SECTION_LABELS[name]
  return labels ? `${labels[language]}${suffix}` : canonical
}

export function translateTitleLabel(language: OutputLanguage): string {
  return TITLE_LABELS[language]
}
