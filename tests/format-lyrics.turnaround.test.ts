import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Turnaround", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Turnaround\nline 1", PLAIN).sections).toEqual([
      "Turnaround",
    ])
    expect(formatLyrics("Переход\nline 1", PLAIN).sections).toEqual([
      "Turnaround",
    ])
    expect(formatLyrics("Перехід\nline 1", PLAIN).sections).toEqual([
      "Turnaround",
    ])
  })
})
