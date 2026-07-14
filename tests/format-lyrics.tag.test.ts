import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics } from "@/lib/format-lyrics"

describe("Tag", () => {
  it("recognizes English, Russian, and 'Coda' aliases", () => {
    expect(formatLyrics("Tag\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Тег\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Coda\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Кода\nline 1", PLAIN).sections).toEqual(["Tag"])
  })

  it("recognizes a mixed-script 'Teг' (Latin T/e + Cyrillic г)", () => {
    expect(formatLyrics("Teг:\nline 1", PLAIN).sections).toEqual(["Tag"])
  })

  it("recognizes 'Post Chorus' (Ukrainian/Russian/English) as a Tag", () => {
    expect(formatLyrics("Пост приспів\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Постприпев\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Post Chorus\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
  })

  it("collapses 'Chorus Tag'/'Bridge 1 Tag'/'Verse Coda' down to a plain Tag group", () => {
    expect(formatLyrics("Chorus Tag:\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Bridge 1 Tag:\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
    expect(formatLyrics("Verse Coda\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
  })

  it("still collapses to Tag when a chord progression follows the tag word", () => {
    expect(
      formatLyrics("Bridge Tag: Dm/Gm/C\nline 1", PLAIN).sections
    ).toEqual(["Tag"])
  })

  it("keeps a number placed after the tag word, but drops one placed before it", () => {
    expect(formatLyrics("Verse Tag 2\nline 1", PLAIN).sections).toEqual([
      "Tag 2",
    ])
    // the "1" here numbers "Bridge", which is dropped along with the name -
    // it does not carry over to the collapsed Tag group.
    expect(formatLyrics("Bridge 1 Tag\nline 1", PLAIN).sections).toEqual([
      "Tag",
    ])
  })
})
