interface GroupDefinition {
  canonical: string
  aliases: string[]
}

// English/Russian/Ukrainian/German names ProPresenter recognizes as
// arrangement group labels when wrapped in square brackets (e.g.
// "[Verse 1]"), or written plainly on their own line in the pasted lyrics.
const GROUP_DEFINITIONS: GroupDefinition[] = [
  { canonical: "Verse", aliases: ["verse", "куплет", "strophe"] },
  { canonical: "Chorus", aliases: ["chorus", "припев", "приспів", "refrain"] },
  { canonical: "Bridge", aliases: ["bridge", "бридж", "брідж", "мост"] },
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
      "вставка",
    ],
  },
  // "teг" mixes a Latin "T"/"e" with a Cyrillic "г" — a common artifact of
  // copying lyrics from mixed-keyboard-layout sources.
  {
    canonical: "Tag",
    aliases: [
      "tag",
      "тег",
      "teг",
      "coda",
      "кода",
      // Post-chorus: a short repeated phrase after the chorus — treated as
      // a Tag rather than its own group, same reasoning as Coda.
      "post chorus",
      "postchorus",
      "постприпев",
      "пост приспів",
    ],
  },
  { canonical: "Intro", aliases: ["intro", "интро", "інтро"] },
  {
    canonical: "Ending",
    aliases: ["ending", "концовка", "кінцівка", "schluss"],
  },
  { canonical: "Outro", aliases: ["outro", "аутро"] },
  {
    canonical: "Interlude",
    aliases: [
      "interlude",
      "проигрыш",
      "програш",
      "instrumental",
      "инструментал",
      "zwischenspiel",
    ],
  },
  { canonical: "Vamp", aliases: ["vamp", "вамп"] },
  { canonical: "Turnaround", aliases: ["turnaround", "переход", "перехід"] },
  { canonical: "Blank", aliases: ["blank", "пусто", "порожньо", "leer"] },
]

export const STEM_TO_CANONICAL = new Map<string, string>()
for (const group of GROUP_DEFINITIONS) {
  for (const alias of group.aliases) {
    STEM_TO_CANONICAL.set(alias, group.canonical)
  }
}
