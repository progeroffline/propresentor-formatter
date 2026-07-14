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
