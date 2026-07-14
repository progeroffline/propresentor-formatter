import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Intro", () => {
  it("recognizes English, Russian, and Ukrainian aliases", () => {
    expect(formatLyrics("Intro\nline 1", PLAIN).sections).toEqual(["Intro"])
    expect(formatLyrics("Интро\nline 1", PLAIN).sections).toEqual(["Intro"])
    expect(formatLyrics("Інтро\nline 1", PLAIN).sections).toEqual(["Intro"])
  })
})
