import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics, type FormatOptions } from "@/lib/format-lyrics"

describe("header parsing mechanics", () => {
  it("recognizes a bracketed header and is case-insensitive", () => {
    expect(formatLyrics("[Verse 1]\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
    expect(formatLyrics("ПРИПЕВ\nline 1", PLAIN).sections).toEqual(["Chorus"])
  })

  it("produces a header-only group when a repeat marker has no lyrics under it", () => {
    const result = formatLyrics("Verse\nline 1\n\nChorus x2", PLAIN)
    expect(result.sections).toEqual(["Verse", "Chorus"])
    expect(result.slideCount).toBe(1)
    expect(result.output).toBe("[Verse]\nline 1\n\n[Chorus]")
  })
})

describe("Title: prefix", () => {
  it("prefixes the leading unlabeled block when the song has other sections", () => {
    const result = formatLyrics("Song Name (Author)\n\nVerse\nline 1", PLAIN)
    expect(result.output).toBe("Title: Song Name (Author)\n\n[Verse]\nline 1")
  })

  it("does not add a Title prefix when the song has no recognized sections", () => {
    const result = formatLyrics("Just some text\n\nMore text", PLAIN)
    expect(result.output).toBe("Just some text\n\nMore text")
    expect(result.sections).toEqual([])
  })

  it("does not add a Title: prefix when a section header comes first", () => {
    const result = formatLyrics("Verse\nline 1", PLAIN)
    expect(result.output).toBe("[Verse]\nline 1")
  })
})

describe("formatting options", () => {
  it("removes http/https and www links, dropping lines left empty", () => {
    const options: FormatOptions = { ...PLAIN, removeLinks: true }
    const result = formatLyrics(
      "Verse\nline one https://example.com/source\n\nSource: www.example.org",
      options
    )
    expect(result.output).toBe("[Verse]\nline one\n\nSource:")
  })

  it("strips punctuation (including quotes) from lyric lines", () => {
    const options: FormatOptions = { ...PLAIN, removePunctuation: true }
    const result = formatLyrics("Verse\nHello, world!\nIt's fine.", options)
    expect(result.output).toBe("[Verse]\nHello world\nIts fine")
  })

  it("capitalizes only the first letter of each slide", () => {
    const options: FormatOptions = { ...PLAIN, capitalizeSlides: true }
    const result = formatLyrics("verse\nline one\n\nchorus\nline two", options)
    expect(result.output).toBe("[Verse]\nLine one\n\n[Chorus]\nLine two")
  })

  it("capitalizes Ukrainian-specific first letters (і/ї/є/ґ)", () => {
    const options: FormatOptions = { ...PLAIN, capitalizeSlides: true }
    expect(formatLyrics("Verse\nіснує рядок", options).output).toBe(
      "[Verse]\nІснує рядок"
    )
    expect(formatLyrics("Verse\nєдиний рядок", options).output).toBe(
      "[Verse]\nЄдиний рядок"
    )
  })
})

describe("real-world song structures (placeholder lyrics)", () => {
  // These mirror the section markup style of user-submitted worship songs
  // (colon-terminated headers, "x2"/"х2" repeat markers, numbers before or
  // after the group name, a trailing source link) with the actual lyrics
  // replaced by generic placeholder lines.
  it("formats a Russian chorus/verse/bridge song with repeat markers and a trailing link", () => {
    const input = [
      "Song Name (Publisher)",
      "",
      "Припев: х2",
      "line a1",
      "line a2",
      "",
      "Куплет: x2",
      "line b1",
      "line b2",
      "",
      "Припев: x2",
      "line a1",
      "line a2",
      "",
      "Бридж:",
      "line c1",
      "line c2",
      "",
      "Бридж:",
      "line c1",
      "line c3",
      "",
      "Припев: x2",
      "line a1",
      "line a2",
      "",
      "https://example.com/12345",
    ].join("\n")

    const result = formatLyrics(input, { ...PLAIN, removeLinks: true })

    expect(result.sections).toEqual([
      "Chorus",
      "Verse",
      "Chorus",
      "Bridge",
      "Bridge",
      "Chorus",
    ])
    expect(result.output).toContain("Title: Song Name (Publisher)")
    expect(result.output).toContain("[Chorus]")
    expect(result.output).toContain("[Verse]")
    expect(result.output).toContain("[Bridge]")
    // the trailing source link forms its own empty chunk and is dropped
    expect(result.output).not.toContain("example.com")
  })

  it("formats an English verse/chorus/bridge song with leading and trailing numbers", () => {
    const input = [
      "Intro:",
      "line intro",
      "",
      "1 Verse:",
      "line v1a",
      "line v1b",
      "",
      "Chorus 1:",
      "line c1a",
      "line c1b",
      "",
      "2 Verse:",
      "line v2a",
      "",
      "Chorus 2:",
      "line c1a",
      "line c1b",
      "",
      "Bridge 1:",
      "line br1",
      "",
      "3 Verse:",
      "line v3a",
    ].join("\n")

    const result = formatLyrics(input, PLAIN)

    expect(result.sections).toEqual([
      "Intro",
      "Verse 1",
      "Chorus 1",
      "Verse 2",
      "Chorus 2",
      "Bridge 1",
      "Verse 3",
    ])
  })

  it("formats a Russian song using PreChorus written with a space, and Interlude/Intro", () => {
    const input = [
      "Интро:",
      "",
      "1 куплет:",
      "line v1",
      "",
      "Пред припев:",
      "line pc1",
      "",
      "Проигрыш:",
      "",
      "2 куплет:",
      "line v2",
      "",
      "Припев: х2",
      "line ch1",
      "",
      "Tag:",
      "line ch1",
    ].join("\n")

    const result = formatLyrics(input, PLAIN)

    expect(result.sections).toEqual([
      "Intro",
      "Verse 1",
      "PreChorus",
      "Interlude",
      "Verse 2",
      "Chorus",
      "Tag",
    ])
  })
})
