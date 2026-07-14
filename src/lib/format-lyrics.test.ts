import { describe, expect, it } from "vitest"

import { formatLyrics, type FormatOptions } from "./format-lyrics"

const PLAIN: FormatOptions = {
  capitalizeSlides: false,
  removePunctuation: false,
  removeLinks: false,
}

describe("group header recognition", () => {
  it("recognizes English and Russian aliases", () => {
    expect(formatLyrics("Verse\nline 1", PLAIN).sections).toEqual(["Verse"])
    expect(formatLyrics("Куплет\nline 1", PLAIN).sections).toEqual(["Verse"])
    expect(formatLyrics("Chorus\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Припев\nline 1", PLAIN).sections).toEqual(["Chorus"])
    expect(formatLyrics("Bridge\nline 1", PLAIN).sections).toEqual(["Bridge"])
    expect(formatLyrics("Бридж\nline 1", PLAIN).sections).toEqual(["Bridge"])
  })

  it("recognizes PreChorus written as one word or two, in English or Russian", () => {
    expect(formatLyrics("PreChorus\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Pre Chorus\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Предприпев\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
    expect(formatLyrics("Пред припев\nline 1", PLAIN).sections).toEqual([
      "PreChorus",
    ])
  })

  it("recognizes the remaining group names", () => {
    expect(formatLyrics("Tag\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Тег\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Intro\nline 1", PLAIN).sections).toEqual(["Intro"])
    expect(formatLyrics("Интро\nline 1", PLAIN).sections).toEqual(["Intro"])
    expect(formatLyrics("Ending\nline 1", PLAIN).sections).toEqual(["Ending"])
    expect(formatLyrics("Концовка\nline 1", PLAIN).sections).toEqual([
      "Ending",
    ])
    expect(formatLyrics("Outro\nline 1", PLAIN).sections).toEqual(["Outro"])
    expect(formatLyrics("Аутро\nline 1", PLAIN).sections).toEqual(["Outro"])
    expect(formatLyrics("Interlude\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Проигрыш\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Vamp\nline 1", PLAIN).sections).toEqual(["Vamp"])
    expect(formatLyrics("Вамп\nline 1", PLAIN).sections).toEqual(["Vamp"])
    expect(formatLyrics("Turnaround\nline 1", PLAIN).sections).toEqual([
      "Turnaround",
    ])
    expect(formatLyrics("Переход\nline 1", PLAIN).sections).toEqual([
      "Turnaround",
    ])
    expect(formatLyrics("Blank\nline 1", PLAIN).sections).toEqual(["Blank"])
    expect(formatLyrics("Пусто\nline 1", PLAIN).sections).toEqual(["Blank"])
  })

  it("accepts a number before or after the group name", () => {
    expect(formatLyrics("Verse 2\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
    expect(formatLyrics("2 Verse\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
    expect(formatLyrics("Куплет 2\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
    expect(formatLyrics("2 Куплет\nline 1", PLAIN).sections).toEqual([
      "Verse 2",
    ])
  })

  it("strips a trailing colon, comma, or period from the header line", () => {
    expect(formatLyrics("Куплет 1:\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
    expect(formatLyrics("Chorus,\nline 1", PLAIN).sections).toEqual([
      "Chorus",
    ])
    expect(formatLyrics("Бридж.\nline 1", PLAIN).sections).toEqual(["Bridge"])
  })

  it("recognizes a bracketed header and is case-insensitive", () => {
    expect(formatLyrics("[Verse 1]\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
    expect(formatLyrics("ПРИПЕВ\nline 1", PLAIN).sections).toEqual(["Chorus"])
  })

  it("treats a trailing x2/х2 repeat marker as decoration, not content", () => {
    expect(formatLyrics("Припев: х2\nline 1", PLAIN).sections).toEqual([
      "Chorus",
    ])
    expect(formatLyrics("Chorus x2\nline 1", PLAIN).sections).toEqual([
      "Chorus",
    ])
    expect(formatLyrics("Куплет: x2\nline 1", PLAIN).sections).toEqual([
      "Verse",
    ])
  })

  it("produces a header-only group when a repeat marker has no lyrics under it", () => {
    const result = formatLyrics("Verse\nline 1\n\nChorus x2", PLAIN)
    expect(result.sections).toEqual(["Verse", "Chorus"])
    expect(result.slideCount).toBe(1)
    expect(result.output).toBe("[Verse]\nline 1\n\n[Chorus]")
  })

  it("produces a header-only Interlude for a standalone 'Проигрыш:' with nothing under it", () => {
    const result = formatLyrics(
      "Verse\nline 1\n\nПроигрыш:\n\nChorus\nline 2",
      PLAIN
    )
    expect(result.sections).toEqual(["Verse", "Interlude", "Chorus"])
    expect(result.slideCount).toBe(2)
    expect(result.output).toBe(
      "[Verse]\nline 1\n\n[Interlude]\n\n[Chorus]\nline 2"
    )
  })

  it("drops a chord progression tacked onto the same line as a header", () => {
    const result = formatLyrics(
      "Verse\nline 1\n\nПроигрыш Dsus2/Dm/Gm/C/Dm/\n\nChorus\nline 2",
      PLAIN
    )
    expect(result.sections).toEqual(["Verse", "Interlude", "Chorus"])
    expect(result.slideCount).toBe(2)
    expect(result.output).toBe(
      "[Verse]\nline 1\n\n[Interlude]\n\n[Chorus]\nline 2"
    )
  })

  it("still reads a numbered section that has a chord suffix", () => {
    expect(formatLyrics("Bridge 1 Am/F/C/G\nline 1", PLAIN).sections).toEqual(
      ["Bridge 1"]
    )
    expect(formatLyrics("1 Verse Dm/Am\nline 1", PLAIN).sections).toEqual([
      "Verse 1",
    ])
  })

  it("drops a chord suffix even when a colon sits right after the name", () => {
    const result = formatLyrics(
      "Verse\nline 1\n\nПроигрыш:    Dsus2/Dm/Gm/C/Dm/\n\nChorus\nline 2",
      PLAIN
    )
    expect(result.sections).toEqual(["Verse", "Interlude", "Chorus"])
    expect(result.output).toBe(
      "[Verse]\nline 1\n\n[Interlude]\n\n[Chorus]\nline 2"
    )
  })
})

describe("Title: prefix", () => {
  it("prefixes the leading unlabeled block when the song has other sections", () => {
    const result = formatLyrics("Song Name (Author)\n\nVerse\nline 1", PLAIN)
    expect(result.output).toBe(
      "Title: Song Name (Author)\n\n[Verse]\nline 1"
    )
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

describe("extra label variants", () => {
  it("treats 'Instrumental' as an alias for Interlude", () => {
    expect(formatLyrics("Instrumental\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Инструментал\nline 1", PLAIN).sections).toEqual([
      "Interlude",
    ])
    expect(formatLyrics("Instrumental 1:\nline 1", PLAIN).sections).toEqual([
      "Interlude 1",
    ])
  })

  it("treats 'Coda' as an alias for Tag", () => {
    expect(formatLyrics("Coda\nline 1", PLAIN).sections).toEqual(["Tag"])
    expect(formatLyrics("Кода\nline 1", PLAIN).sections).toEqual(["Tag"])
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
})
