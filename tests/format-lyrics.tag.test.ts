import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Tag", () => {
  it("recognizes English, Russian, and 'Coda' aliases", () => {
    expect(formatLyrics("Tag\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Тег\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Coda\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Кода\nline 1", PLAIN).sections).toEqual(["Tag"])
  })

  it("recognizes a mixed-script 'Teг' (Latin T/e + Cyrillic г)", () => {
    expect(formatLyrics("Teг:\nline 1", PLAIN).sections).toEqual(["Tag"])
  })

  it("collapses 'Chorus Tag'/'Bridge 1 Tag'/'Verse Coda' down to a plain Tag group", () => {
    expect(formatLyrics("Chorus Tag:\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Bridge 1 Tag:\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Verse Coda\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
  })
})
