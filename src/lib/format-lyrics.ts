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

  return (
    text
      .trim()
      .toLowerCase()
      // Drop a trailing repeat marker like "Припев: х2" or "Chorus x2" —
      // it means "repeat this section", not a numbered variant.
      .replace(/[\s:,.\-–—]*[xх×]\s*\d+$/i, "")
      .replace(/[-–—:,.!?]+$/, "")
      .replace(/[-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

// A trailing chord progression tacked onto a header line (e.g. "Проигрыш
// Dm/Gm/C/Dm/") is dropped rather than blocking header recognition — but
// only when it actually looks like chords, so ordinary prose that happens to
// start with a group name (e.g. "Bridge to nowhere") isn't misread as a
// header with the rest of the line silently discarded.
const CHORD_TOKEN_PATTERN =
  /^[a-g][#b]?(?:maj|min|sus2|sus4|sus|dim|aug|add\d?|m)?\d*(?:\/[a-g][#b]?(?:maj|min|sus2|sus4|sus|dim|aug|add\d?|m)?\d*)*\/?$/i
const CHORD_MARKER_PATTERN = /[\d/]|maj|min|sus2|sus4|sus|dim|aug|add|m/i

function looksLikeChordSuffix(tokens: string[]): boolean {
  if (tokens.length === 0 || !tokens.every((token) => CHORD_TOKEN_PATTERN.test(token))) {
    return false
  }

  // A bare note name like "a" (no digit, slash, or extension) is
  // structurally valid but indistinguishable from an ordinary short word —
  // require at least one token to carry an actual chord-like marker.
  return tokens.some((token) => CHORD_MARKER_PATTERN.test(token))
}

const ROMAN_NUMERAL_VALUES: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
  xi: 11,
  xii: 12,
  xiii: 13,
  xiv: 14,
  xv: 15,
  xvi: 16,
  xvii: 17,
  xviii: 18,
  xix: 19,
  xx: 20,
}

function matchLeadingNumber(token: string | undefined): string | undefined {
  if (!token) {
    return undefined
  }
  if (/^\d+$/.test(token)) {
    return token
  }
  const parenMatch = token.match(/^\((\d+)\)$/)
  return parenMatch ? parenMatch[1] : undefined
}

// Trailing numbers additionally accept roman numerals ("Verse II"), since
// that convention only ever follows the name, never precedes it.
function matchTrailingNumber(token: string | undefined): string | undefined {
  const plain = matchLeadingNumber(token)
  if (plain !== undefined) {
    return plain
  }
  if (!token) {
    return undefined
  }
  const roman = ROMAN_NUMERAL_VALUES[token.toLowerCase()]
  return roman === undefined ? undefined : String(roman)
}

function matchGroupHeader(line: string): string | null {
  const normalized = normalizeHeaderCandidate(line)
  if (!normalized) {
    return null
  }

  // Each token gets its own trailing punctuation stripped (not just the end
  // of the whole line), since a colon can sit right after the name even
  // when something else — like a chord progression — follows it.
  const tokens = normalized
    .split(" ")
    .map((token) => token.replace(/[:,.!?]+$/, ""))
    .filter((token) => token.length > 0)
  if (tokens.length === 0) {
    return null
  }

  // The section number can come either before the name ("1 Куплет") or
  // after it ("Куплет 2" / "Verse 2"), since both orderings are common.
  let index = 0
  const leadingNumber = matchLeadingNumber(tokens[index])
  if (leadingNumber !== undefined) {
    index += 1
  }

  const maxStemWords = Math.min(2, tokens.length - index)
  for (let wordCount = maxStemWords; wordCount >= 1; wordCount -= 1) {
    const stem = tokens.slice(index, index + wordCount).join(" ")
    const canonical = STEM_TO_CANONICAL.get(stem)
    if (!canonical) {
      continue
    }

    const afterStem = index + wordCount
    const stemNumber = matchTrailingNumber(tokens[afterStem])
    const afterStemNumber = stemNumber !== undefined ? afterStem + 1 : afterStem

    // "Chorus Tag", "Bridge 1 Tag", "Verse Coda", etc. — whatever group name
    // or number comes before a trailing "Tag"/"Coda" word is dropped; it's
    // still just a single Tag group. A number placed *after* the tag word
    // ("Verse Tag 2") is kept, since it numbers the tag itself.
    let tagAt: number | undefined
    if (tokens[afterStem] && STEM_TO_CANONICAL.get(tokens[afterStem]) === "Tag") {
      tagAt = afterStem
    } else if (
      stemNumber !== undefined &&
      tokens[afterStemNumber] &&
      STEM_TO_CANONICAL.get(tokens[afterStemNumber]) === "Tag"
    ) {
      tagAt = afterStemNumber
    }

    if (tagAt !== undefined) {
      let cursor = tagAt + 1
      const tagNumber = matchTrailingNumber(tokens[cursor])
      if (tagNumber !== undefined) {
        cursor += 1
      }
      const remaining = tokens.slice(cursor)
      if (remaining.length > 0 && !looksLikeChordSuffix(remaining)) {
        continue
      }
      return tagNumber ? `Tag ${tagNumber}` : "Tag"
    }

    // Anything past the recognized name (and its number) is only ignored
    // when it looks like a chord progression — otherwise this line is real
    // prose that merely starts with a group name, not a header.
    const remaining = tokens.slice(afterStemNumber)
    if (remaining.length > 0 && !looksLikeChordSuffix(remaining)) {
      continue
    }

    const number = leadingNumber ?? stemNumber
    return number ? `${canonical} ${number}` : canonical
  }

  return null
}

function capitalizeSlideText(lines: string[]): string[] {
  const lineIndex = lines.findIndex((line) => /[a-zа-яёіїєґ]/i.test(line))
  if (lineIndex === -1) {
    return lines
  }

  const line = lines[lineIndex]
  const letterIndex = line.search(/[a-zа-яёіїєґ]/i)
  const capitalized =
    line.slice(0, letterIndex) +
    line[letterIndex].toUpperCase() +
    line.slice(letterIndex + 1)

  return [...lines.slice(0, lineIndex), capitalized, ...lines.slice(lineIndex + 1)]
}

function stripPunctuation(lines: string[]): string[] {
  return lines
    .map((line) =>
      line
        .replace(PUNCTUATION_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter((line) => line.length > 0)
}

function stripLinks(lines: string[]): string[] {
  return lines
    .map((line) =>
      line
        .replace(URL_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter((line) => line.length > 0)
}

type Block =
  { type: "header"; text: string } | { type: "slide"; lines: string[] }

export function formatLyrics(
  input: string,
  options: FormatOptions
): FormatResult {
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

      // Each lyric line becomes its own slide, so a multi-line chunk (a
      // verse/chorus with several lines under one header) turns into that
      // many separate blocks rather than one slide with several lines.
      for (let line of lines) {
        if (options.capitalizeSlides) {
          ;[line] = capitalizeSlideText([line])
        }
        blocks.push({ type: "slide", lines: [line] })
      }
    }
  }

  // A leading, unlabeled slide (typically the song name and author) gets a
  // "Title: " prefix, but only when the song actually has other recognized
  // sections later on — otherwise there's nothing to set it apart from.
  const firstBlock = blocks[0]
  const hasAnyHeader = blocks.some((block) => block.type === "header")
  const isTitleSlide =
    firstBlock !== undefined &&
    firstBlock.type === "slide" &&
    hasAnyHeader

  // The structured slides used for display are captured before the
  // "Title: " prefix is baked into the block below, so the UI can style
  // the title slide distinctly without showing that ProPresenter marker;
  // the plain-text `output` (used for copy/paste into ProPresenter) still
  // gets the prefix via the blocks mutation further down.
  const slides: FormatSlide[] = []
  let currentHeader: string | null = null
  for (const block of blocks) {
    if (block.type === "header") {
      currentHeader = block.text
      continue
    }
    slides.push({
      header: currentHeader,
      lines: block.lines,
      isTitle: isTitleSlide && block === firstBlock,
    })
  }

  if (isTitleSlide && firstBlock.type === "slide") {
    const [firstLine, ...rest] = firstBlock.lines
    firstBlock.lines = [`Title: ${firstLine}`, ...rest]
  }

  const sections = blocks
    .filter(
      (block): block is { type: "header"; text: string } =>
        block.type === "header"
    )
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
    slides,
  }
}
