export interface FormatOptions {
  capitalizeSlides: boolean
  removePunctuation: boolean
  removeLinks: boolean
}

export interface FormatResult {
  output: string
  slideCount: number
  sections: string[]
}

interface GroupDefinition {
  canonical: string
  aliases: string[]
}

// English/Russian names ProPresenter recognizes as arrangement group labels
// when wrapped in square brackets (e.g. "[Verse 1]"), or written plainly on
// their own line in the pasted lyrics.
const GROUP_DEFINITIONS: GroupDefinition[] = [
  { canonical: "Verse", aliases: ["verse", "куплет"] },
  { canonical: "Chorus", aliases: ["chorus", "припев"] },
  { canonical: "Bridge", aliases: ["bridge", "бридж"] },
  { canonical: "PreChorus", aliases: ["prechorus", "pre chorus", "предприпев"] },
  { canonical: "Tag", aliases: ["tag", "тег"] },
  { canonical: "Intro", aliases: ["intro", "интро"] },
  { canonical: "Ending", aliases: ["ending", "концовка"] },
  { canonical: "Outro", aliases: ["outro", "аутро"] },
  { canonical: "Interlude", aliases: ["interlude", "проигрыш"] },
  { canonical: "Vamp", aliases: ["vamp", "вамп"] },
  { canonical: "Turnaround", aliases: ["turnaround", "переход"] },
  { canonical: "Blank", aliases: ["blank", "пусто"] },
]

const STEM_TO_CANONICAL = new Map<string, string>()
for (const group of GROUP_DEFINITIONS) {
  for (const alias of group.aliases) {
    STEM_TO_CANONICAL.set(alias, group.canonical)
  }
}

const PUNCTUATION_PATTERN = /[.,!?;:"'«»…()]/g
const URL_PATTERN = /https?:\/\/\S+|www\.\S+/gi

function normalizeHeaderCandidate(line: string): string {
  const bracketMatch = line.trim().match(/^\[(.+)\]$/)
  const text = bracketMatch ? bracketMatch[1] : line

  return text
    .trim()
    .toLowerCase()
    // Drop a trailing repeat marker like "Припев: х2" or "Chorus x2" —
    // it means "repeat this section", not a numbered variant.
    .replace(/[\s:,.\-–—]*[xх×]\s*\d+$/i, "")
    .replace(/[-–—:,.]+$/, "")
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function matchGroupHeader(line: string): string | null {
  const normalized = normalizeHeaderCandidate(line)
  if (!normalized) {
    return null
  }

  // The section number can come either before the name ("1 Куплет") or
  // after it ("Куплет 2" / "Verse 2"), since both orderings are common.
  const match = normalized.match(
    /^(?:(\d+)\s+)?([a-zа-яё]+(?: [a-zа-яё]+)*?)(?:\s+(\d+))?$/i
  )
  if (!match) {
    return null
  }

  const [, leadingNumber, stem, trailingNumber] = match
  const canonical = STEM_TO_CANONICAL.get(stem)
  if (!canonical) {
    return null
  }

  const number = leadingNumber ?? trailingNumber
  return number ? `${canonical} ${number}` : canonical
}

function capitalizeSlideText(lines: string[]): string[] {
  if (lines.length === 0) {
    return lines
  }

  const [firstLine, ...rest] = lines
  const letterMatch = firstLine.match(/[a-zа-яё]/i)
  if (!letterMatch || letterMatch.index === undefined) {
    return [firstLine, ...rest]
  }

  const index = letterMatch.index
  const capitalized =
    firstLine.slice(0, index) +
    firstLine[index].toUpperCase() +
    firstLine.slice(index + 1)

  return [capitalized, ...rest]
}

function stripPunctuation(lines: string[]): string[] {
  return lines.map((line) =>
    line.replace(PUNCTUATION_PATTERN, "").replace(/\s{2,}/g, " ").trim()
  )
}

function stripLinks(lines: string[]): string[] {
  return lines
    .map((line) => line.replace(URL_PATTERN, "").replace(/\s{2,}/g, " ").trim())
    .filter((line) => line.length > 0)
}

type Block =
  | { type: "header"; text: string }
  | { type: "slide"; lines: string[] }

export function formatLyrics(input: string, options: FormatOptions): FormatResult {
  const chunks = input
    .trim()
    .split(/\r?\n\s*\r?\n+/)
    .map((chunk) => chunk.split(/\r?\n/).map((line) => line.trim()))
    .filter((chunk) => chunk.some((line) => line.length > 0))

  const blocks: Block[] = []

  for (const chunk of chunks) {
    const [firstLine, ...rest] = chunk
    const header = matchGroupHeader(firstLine)
    const slideLines = (header ? rest : chunk).filter((line) => line.length > 0)

    if (header) {
      blocks.push({ type: "header", text: header })
    }

    if (slideLines.length > 0) {
      let lines = slideLines
      if (options.removeLinks) {
        lines = stripLinks(lines)
      }
      if (options.removePunctuation) {
        lines = stripPunctuation(lines)
      }
      if (options.capitalizeSlides) {
        lines = capitalizeSlideText(lines)
      }
      if (lines.length > 0) {
        blocks.push({ type: "slide", lines })
      }
    }
  }

  // A leading, unlabeled slide (typically the song name and author) gets a
  // "Title: " prefix, but only when the song actually has other recognized
  // sections later on — otherwise there's nothing to set it apart from.
  const firstBlock = blocks[0]
  const hasAnyHeader = blocks.some((block) => block.type === "header")
  if (firstBlock && firstBlock.type === "slide" && hasAnyHeader) {
    const [firstLine, ...rest] = firstBlock.lines
    firstBlock.lines = [`Title: ${firstLine}`, ...rest]
  }

  const sections = blocks
    .filter((block): block is { type: "header"; text: string } => block.type === "header")
    .map((block) => block.text)

  const slideCount = blocks.filter((block) => block.type === "slide").length

  const outputParts: string[] = []
  blocks.forEach((block, index) => {
    const previous = blocks[index - 1]

    if (block.type === "header") {
      if (previous) {
        outputParts.push("")
      }
      outputParts.push(`[${block.text}]`)
      return
    }

    if (previous && previous.type === "slide") {
      outputParts.push("")
    }
    outputParts.push(block.lines.join("\n"))
  })

  return {
    output: outputParts.join("\n"),
    slideCount,
    sections,
  }
}
