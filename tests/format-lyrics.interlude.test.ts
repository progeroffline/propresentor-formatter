import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Interlude", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Interlude\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Проигрыш\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Програш\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
  })

  it("treats 'Instrumental' as an alias too", () => {
    expect(formatLyrics("Instrumental\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Инструментал\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Instrumental 1:\nline 1", PLAIN).sections).toEqual([
      "Interlude 1",
    ])
  })

  it("produces a header-only group for a standalone 'Проигрыш:' with nothing under it", () => {
    expect(formatLyrics("Проигрыш:", PLAIN)).toEqual({
      output: "[Interlude]",
      slideCount: 0,
      sections: ["Interlude"],
    })
  })

  it("drops a chord progression tacked onto the same line as the header", () => {
    expect(
      formatLyrics("Проигрыш Dsus2/Dm/Gm/C/Dm/\nline 1", PLAIN).sections
    ).toEqual(["Interlude"])
    // ...even when a colon sits right after the name, before the chords.
    expect(
      formatLyrics("Проигрыш:    Dsus2/Dm/Gm/C/Dm/\nline 1", PLAIN).sections
    ).toEqual(["Interlude"])
  })
})
