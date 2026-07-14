import { STEM_TO_CANONICAL } from "./group-definitions"

function normalizeHeaderCandidate(line: string): string {
  const bracketMatch = line.trim().match(/^\[(.+)\]$/)
  const text = bracketMatch ? bracketMatch[1] : line

  return (
    text
      .trim()
      .toLowerCase()
      // Drop a trailing repeat marker like "Припев: х2" or "Chorus x2" —
      // it means "repeat this section", not a numbered variant.
      .replace(/[\s:,.\-–—]*[xх×]\s*\d+$/i, "")
      .replace(/[-–—:,.!?]+$/, "")
      .replace(/[-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

// A trailing chord progression tacked onto a header line (e.g. "Проигрыш
// Dm/Gm/C/Dm/") is dropped rather than blocking header recognition — but
// only when it actually looks like chords, so ordinary prose that happens to
// start with a group name (e.g. "Bridge to nowhere") isn't misread as a
// header with the rest of the line silently discarded.
const CHORD_TOKEN_PATTERN =
  /^[a-g][#b]?(?:maj|min|sus2|sus4|sus|dim|aug|add\d?|m)?\d*(?:\/[a-g][#b]?(?:maj|min|sus2|sus4|sus|dim|aug|add\d?|m)?\d*)*\/?$/i
const CHORD_MARKER_PATTERN = /[\d/]|maj|min|sus2|sus4|sus|dim|aug|add|m/i

function looksLikeChordSuffix(tokens: string[]): boolean {
  if (
    tokens.length === 0 ||
    !tokens.every((token) => CHORD_TOKEN_PATTERN.test(token))
  ) {
    return false
  }

  // A bare note name like "a" (no digit, slash, or extension) is
  // structurally valid but indistinguishable from an ordinary short word —
  // require at least one token to carry an actual chord-like marker.
  return tokens.some((token) => CHORD_MARKER_PATTERN.test(token))
}

const ROMAN_NUMERAL_VALUES: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
  xi: 11,
  xii: 12,
  xiii: 13,
  xiv: 14,
  xv: 15,
  xvi: 16,
  xvii: 17,
  xviii: 18,
  xix: 19,
  xx: 20,
}

function matchLeadingNumber(token: string | undefined): string | undefined {
  if (!token) {
    return undefined
  }
  if (/^\d+$/.test(token)) {
    return token
  }
  const parenMatch = token.match(/^\((\d+)\)$/)
  return parenMatch ? parenMatch[1] : undefined
}

// Trailing numbers additionally accept roman numerals ("Verse II"), since
// that convention only ever follows the name, never precedes it.
function matchTrailingNumber(token: string | undefined): string | undefined {
  const plain = matchLeadingNumber(token)
  if (plain !== undefined) {
    return plain
  }
  if (!token) {
    return undefined
  }
  const roman = ROMAN_NUMERAL_VALUES[token.toLowerCase()]
  return roman === undefined ? undefined : String(roman)
}

export function matchGroupHeader(line: string): string | null {
  const normalized = normalizeHeaderCandidate(line)
  if (!normalized) {
    return null
  }

  // Each token gets its own trailing punctuation stripped (not just the end
  // of the whole line), since a colon can sit right after the name even
  // when something else — like a chord progression — follows it.
  const tokens = normalized
    .split(" ")
    .map((token) => token.replace(/[:,.!?]+$/, ""))
    .filter((token) => token.length > 0)
  if (tokens.length === 0) {
    return null
  }

  // The section number can come either before the name ("1 Куплет") or
  // after it ("Куплет 2" / "Verse 2"), since both orderings are common.
  let index = 0
  const leadingNumber = matchLeadingNumber(tokens[index])
  if (leadingNumber !== undefined) {
    index += 1
  }

  const maxStemWords = Math.min(2, tokens.length - index)
  for (let wordCount = maxStemWords; wordCount >= 1; wordCount -= 1) {
    const stem = tokens.slice(index, index + wordCount).join(" ")
    const canonical = STEM_TO_CANONICAL.get(stem)
    if (!canonical) {
      continue
    }

    const afterStem = index + wordCount
    const stemNumber = matchTrailingNumber(tokens[afterStem])
    const afterStemNumber = stemNumber !== undefined ? afterStem + 1 : afterStem

    // "Chorus Tag", "Bridge 1 Tag", "Verse Coda", etc. — whatever group name
    // or number comes before a trailing "Tag"/"Coda" word is dropped; it's
    // still just a single Tag group. A number placed *after* the tag word
    // ("Verse Tag 2") is kept, since it numbers the tag itself.
    let tagAt: number | undefined
    if (
      tokens[afterStem] &&
      STEM_TO_CANONICAL.get(tokens[afterStem]) === "Tag"
    ) {
      tagAt = afterStem
    } else if (
      stemNumber !== undefined &&
      tokens[afterStemNumber] &&
      STEM_TO_CANONICAL.get(tokens[afterStemNumber]) === "Tag"
    ) {
      tagAt = afterStemNumber
    }

    if (tagAt !== undefined) {
      let cursor = tagAt + 1
      const tagNumber = matchTrailingNumber(tokens[cursor])
      if (tagNumber !== undefined) {
        cursor += 1
      }
      const remaining = tokens.slice(cursor)
      if (remaining.length > 0 && !looksLikeChordSuffix(remaining)) {
        continue
      }
      return tagNumber ? `Tag ${tagNumber}` : "Tag"
    }

    // Anything past the recognized name (and its number) is only ignored
    // when it looks like a chord progression — otherwise this line is real
    // prose that merely starts with a group name, not a header.
    const remaining = tokens.slice(afterStemNumber)
    if (remaining.length > 0 && !looksLikeChordSuffix(remaining)) {
      continue
    }

    const number = leadingNumber ?? stemNumber
    return number ? `${canonical} ${number}` : canonical
  }

  return null
}
