import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("PreChorus", () => {
  it("recognizes English aliases written as one word or two", () => {
    expect(formatLyrics("PreChorus\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Pre Chorus\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
  })

  it("recognizes Russian aliases written as one word or two", () => {
    expect(formatLyrics("Предприпев\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Пред припев\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
  })

  it("recognizes Ukrainian aliases", () => {
    expect(formatLyrics("Запев\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Заспів\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Перед Приспів\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
  })

  it("accepts a number before the name", () => {
    expect(formatLyrics("1 Перед Приспів\nline 1", PLAIN).sections).toEqual([
      "PreChorus 1",
    ])
  })
})
