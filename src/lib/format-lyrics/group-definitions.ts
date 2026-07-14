interface GroupDefinition {
  canonical: string
  aliases: string[]
}

// English/Russian/Ukrainian names ProPresenter recognizes as arrangement
// group labels when wrapped in square brackets (e.g. "[Verse 1]"), or
// written plainly on their own line in the pasted lyrics.
const GROUP_DEFINITIONS: GroupDefinition[] = [
  { canonical: "Verse", aliases: ["verse", "куплет"] },
  { canonical: "Chorus", aliases: ["chorus", "припев", "приспів"] },
  { canonical: "Bridge", aliases: ["bridge", "бридж", "брідж"] },
  {
    canonical: "PreChorus",
    aliases: [
      "prechorus",
      "pre chorus",
      "предприпев",
      "пред припев",
      "запев",
      "заспів",
      "перед приспів",
    ],
  },
  // "teг" mixes a Latin "T"/"e" with a Cyrillic "г" — a common artifact of
  // copying lyrics from mixed-keyboard-layout sources.
  { canonical: "Tag", aliases: ["tag", "тег", "teг", "coda", "кода"] },
  { canonical: "Intro", aliases: ["intro", "интро", "інтро"] },
  { canonical: "Ending", aliases: ["ending", "концовка", "кінцівка"] },
  { canonical: "Outro", aliases: ["outro", "аутро"] },
  {
    canonical: "Interlude",
    aliases: [
      "interlude",
      "проигрыш",
      "програш",
      "instrumental",
      "инструментал",
    ],
  },
  { canonical: "Vamp", aliases: ["vamp", "вамп"] },
  { canonical: "Turnaround", aliases: ["turnaround", "переход", "перехід"] },
  { canonical: "Blank", aliases: ["blank", "пусто", "порожньо"] },
]

export const STEM_TO_CANONICAL = new Map<string, string>()
for (const group of GROUP_DEFINITIONS) {
  for (const alias of group.aliases) {
    STEM_TO_CANONICAL.set(alias, group.canonical)
  }
}
