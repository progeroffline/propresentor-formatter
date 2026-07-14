import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Ending", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Ending\nline 1", PLAIN).sections).toEqual([
      "Ending",
    ])
    expect(formatLyrics("Концовка\nline 1", PLAIN).sections).toEqual([
      "Ending",
    ])
    expect(formatLyrics("Кінцівка\nline 1", PLAIN).sections).toEqual([
      "Ending",
    ])
  })
})
