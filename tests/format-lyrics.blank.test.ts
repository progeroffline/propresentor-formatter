import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Blank", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Blank\nline 1", PLAIN).sections).toEqual(["Blank"])
    expect(formatLyrics("Пусто\nline 1", PLAIN).sections).toEqual(["Blank"])
    expect(formatLyrics("Порожньо\nline 1", PLAIN).sections).toEqual(["Blank"])
  })
})
