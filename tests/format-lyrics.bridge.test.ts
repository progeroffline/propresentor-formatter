import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Bridge", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Bridge\nline 1", PLAIN).sections).toEqual([
      "Bridge",
    ])
    expect(formatLyrics("Бридж\nline 1", PLAIN).sections).toEqual(["Bridge"])
    expect(formatLyrics("Брідж\nline 1", PLAIN).sections).toEqual(["Bridge"])
  })

  it("recognizes the Russian 'Мост' alias, with and without a number", () => {
    expect(formatLyrics("Мост\nline 1", PLAIN).sections).toEqual(["Bridge"])
    expect(formatLyrics("Мост 1\nline 1", PLAIN).sections).toEqual([
      "Bridge 1",
    ])
    expect(formatLyrics("Мост 2\nline 1", PLAIN).sections).toEqual([
      "Bridge 2",
    ])
  })

  it("strips a trailing period", () => {
    expect(formatLyrics("Бридж.\nline 1", PLAIN).sections).toEqual([
      "Bridge",
    ])
  })

  it("accepts a number before the name", () => {
    expect(formatLyrics("2 Брідж\nline 1", PLAIN).sections).toEqual([
      "Bridge 2",
    ])
  })

  it("treats a trailing x2/х2 repeat marker as decoration, not content", () => {
    expect(formatLyrics("Брідж x2\nline 1", PLAIN).sections).toEqual([
      "Bridge",
    ])
  })

  it("still reads a numbered bridge that has a chord suffix", () => {
    expect(formatLyrics("Bridge 1 Am/F/C/G\nline 1", PLAIN).sections).toEqual(
      ["Bridge 1"]
    )
  })
})
