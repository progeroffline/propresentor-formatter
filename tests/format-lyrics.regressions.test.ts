import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("regression: prose starting with a group name is not a header", () => {
  it("does not swallow the rest of the line when it isn't a chord progression", () => {
    const result = formatLyrics("Bridge to nowhere\nsome lyric line", PLAIN)
    expect(result.sections).toEqual([])
    expect(result.output).toBe("Bridge to nowhere\n\nsome lyric line")
  })

  it("does not swallow the rest of the line for a different group name", () => {
    const result = formatLyrics("Verse of the day\nsome lyric line", PLAIN)
    expect(result.sections).toEqual([])
    expect(result.output).toBe("Verse of the day\n\nsome lyric line")
  })
})

describe("regression: header trailing punctuation", () => {
  it("recognizes a header ending in an exclamation or question mark", () => {
    expect(formatLyrics("Chorus!\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Verse?\nline 1", PLAIN).sections).toEqual(["Verse"])
  })
})

describe("regression: section numbering formats", () => {
  it("accepts a parenthesized section number", () => {
    expect(formatLyrics("Verse (2)\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
  })

  it("accepts a roman numeral section number", () => {
    expect(formatLyrics("Verse II\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
  })
})

describe("regression: headers without a blank-line gap", () => {
  it("recognizes a header on its own line even with no blank line before or after it", () => {
    const result = formatLyrics(
      "Куплет\nline v1\nПриспів 1\nline c1\nПриспів 2\nline c2",
      PLAIN
    )
    expect(result.sections).toEqual(["Verse", "Chorus 1", "Chorus 2"])
    expect(result.output).toBe(
      "[Verse]\nline v1\n\n[Chorus 1]\nline c1\n\n[Chorus 2]\nline c2"
    )
  })
})

describe("regression: punctuation-only lines don't leave stray blank lines", () => {
  it("drops a line that becomes empty after removing punctuation", () => {
    const result = formatLyrics("Verse\nHello!!!\nworld", {
      ...PLAIN,
      removePunctuation: true,
    })
    expect(result.output).toBe("[Verse]\nHello\n\nworld")
  })

  it("still capitalizes the first real content line when an earlier line is punctuation-only", () => {
    const result = formatLyrics("Verse\n!!!\nhello world", {
      ...PLAIN,
      removePunctuation: true,
      capitalizeSlides: true,
    })
    expect(result.output).toBe("[Verse]\nHello world")
  })
})
