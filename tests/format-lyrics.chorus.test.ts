import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Chorus", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Chorus\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Припев\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Приспів\nline 1", PLAIN).sections).toEqual(["Chorus"])
  })

  it("is case-insensitive", () => {
    expect(formatLyrics("ПРИПЕВ\nline 1", PLAIN).sections).toEqual(["Chorus"])
  })

  it("strips a trailing comma or colon", () => {
    expect(formatLyrics("Chorus,\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Приспів:\nline 1", PLAIN).sections).toEqual(["Chorus"])
  })

  it("treats a trailing x2/х2 repeat marker as decoration, not content", () => {
    expect(formatLyrics("Припев: х2\nline 1", PLAIN).sections).toEqual([
      "Chorus",
    ])
    expect(formatLyrics("Chorus x2\nline 1", PLAIN).sections).toEqual([
      "Chorus",
    ])
  })
})
