import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Verse", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Verse\nline 1", PLAIN).sections).toEqual(["Verse"])
    expect(formatLyrics("Куплет\nline 1", PLAIN).sections).toEqual(["Verse"])
  })

  it("accepts a number before or after the name", () => {
    expect(formatLyrics("Verse 2\nline 1", PLAIN).sections).toEqual(["Verse 2"])
    expect(formatLyrics("2 Verse\nline 1", PLAIN).sections).toEqual(["Verse 2"])
    expect(formatLyrics("Куплет 2\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
    expect(formatLyrics("2 Куплет\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
  })

  it("strips a trailing colon", () => {
    expect(formatLyrics("Куплет 1:\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
  })

  it("treats a trailing x2/х2 repeat marker as decoration, not content", () => {
    expect(formatLyrics("Куплет: x2\nline 1", PLAIN).sections).toEqual([
      "Verse",
    ])
  })

  it("still reads a numbered verse that has a chord suffix", () => {
    expect(formatLyrics("1 Verse Dm/Am\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
  })
})
