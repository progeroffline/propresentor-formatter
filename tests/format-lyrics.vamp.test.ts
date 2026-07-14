import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Vamp", () => {
  it("recognizes English and Russian/Ukrainian aliases", () => {
    expect(formatLyrics("Vamp\nline 1", PLAIN).sections).toEqual(["Vamp"])
    expect(formatLyrics("Вамп\nline 1", PLAIN).sections).toEqual(["Vamp"])
  })
})
