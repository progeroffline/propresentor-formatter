import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Outro", () => {
  it("recognizes English and Russian/Ukrainian aliases", () => {
    expect(formatLyrics("Outro\nline 1", PLAIN).sections).toEqual(["Outro"])
    expect(formatLyrics("Аутро\nline 1", PLAIN).sections).toEqual(["Outro"])
  })
})
