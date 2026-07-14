import { describe, expect, it } from "vitest"

import { PLAIN } from "./format-lyrics.fixtures"
import { formatLyrics, type FormatOptions } from "@/lib/format-lyrics"

describe("output language", () => {
  it("defaults to English canonical names", () => {
    const result = formatLyrics("Verse\nline 1\n\nChorus\nline 2", PLAIN)
    expect(result.sections).toEqual(["Verse", "Chorus"])
    expect(result.output).toBe("[Verse]\nline 1\n\n[Chorus]\nline 2")
  })

  it("translates section names to Russian", () => {
    const options: FormatOptions = { ...PLAIN, outputLanguage: "ru" }
    const result = formatLyrics(
      "Verse 2\nline 1\n\nBridge\nline 2\n\nTag\nline 3",
      options
    )
    expect(result.sections).toEqual(["Куплет 2", "Бридж", "Тег"])
    expect(result.output).toBe(
      "[Куплет 2]\nline 1\n\n[Бридж]\nline 2\n\n[Тег]\nline 3"
    )
    expect(result.slides[0]).toMatchObject({
      header: "Verse 2",
      headerLabel: "Куплет 2",
    })
  })

  it("translates section names to Ukrainian", () => {
    const options: FormatOptions = { ...PLAIN, outputLanguage: "uk" }
    const result = formatLyrics("Chorus 1\nline 1", options)
    expect(result.sections).toEqual(["Приспів 1"])
    expect(result.output).toBe("[Приспів 1]\nline 1")
  })

  it("translates section names to German", () => {
    const options: FormatOptions = { ...PLAIN, outputLanguage: "de" }
    const result = formatLyrics(
      "Verse\nline 1\n\nChorus\nline 2\n\nInterlude\nline 3",
      options
    )
    expect(result.sections).toEqual(["Strophe", "Refrain", "Interlude"])
    expect(result.output).toBe(
      "[Strophe]\nline 1\n\n[Refrain]\nline 2\n\n[Interlude]\nline 3"
    )
  })

  it("translates the Title: prefix along with sections", () => {
    const options: FormatOptions = { ...PLAIN, outputLanguage: "de" }
    const result = formatLyrics("Song Name\n\nVerse\nline 1", options)
    expect(result.output).toBe("Titel: Song Name\n\n[Strophe]\nline 1")
  })

  it("recognizes German section aliases on input regardless of output language", () => {
    const result = formatLyrics(
      "Strophe\nline 1\n\nRefrain\nline 2\n\nSchluss\nline 3",
      PLAIN
    )
    expect(result.sections).toEqual(["Verse", "Chorus", "Ending"])
  })
})
