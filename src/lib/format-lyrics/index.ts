import { matchGroupHeader } from "./header-matching"
import {
  capitalizeSlideText,
  stripLinks,
  stripPunctuation,
} from "./text-transforms"
import type { FormatOptions, FormatResult, FormatSlide } from "./types"

export type { FormatOptions, FormatResult, FormatSlide } from "./types"

type Block =
  { type: "header"; text: string } | { type: "slide"; lines: string[] }

export function formatLyrics(
  input: string,
  options: FormatOptions
): FormatResult {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const blocks: Block[] = []

  // A section header is recognized on any line, not just the first line
  // after a blank-line gap — some pasted lyrics (e.g. from lyric sites)
  // have no blank lines at all between sections, only the header words
  // themselves marking where one section ends and the next begins.
  for (const rawLine of lines) {
    const header = matchGroupHeader(rawLine)
    if (header) {
      blocks.push({ type: "header", text: header })
      continue
    }

    let slideLines = [rawLine]
    if (options.removeLinks) {
      slideLines = stripLinks(slideLines)
    }
    if (options.removePunctuation) {
      slideLines = stripPunctuation(slideLines)
    }
    if (slideLines.length === 0) {
      continue
    }
    if (options.capitalizeSlides) {
      slideLines = capitalizeSlideText(slideLines)
    }
    blocks.push({ type: "slide", lines: slideLines })
  }

  // A leading, unlabeled slide (typically the song name and author) gets a
  // "Title: " prefix, but only when the song actually has other recognized
  // sections later on — otherwise there's nothing to set it apart from.
  const firstBlock = blocks[0]
  const hasAnyHeader = blocks.some((block) => block.type === "header")
  const isTitleSlide =
    firstBlock !== undefined && firstBlock.type === "slide" && hasAnyHeader

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
