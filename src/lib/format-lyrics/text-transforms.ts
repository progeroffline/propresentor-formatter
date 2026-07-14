const PUNCTUATION_PATTERN = /[.,!?;:"'«»…()]/g
const URL_PATTERN = /https?:\/\/\S+|www\.\S+/gi

export function capitalizeSlideText(lines: string[]): string[] {
  const lineIndex = lines.findIndex((line) => /[a-zа-яёіїєґ]/i.test(line))
  if (lineIndex === -1) {
    return lines
  }

  const line = lines[lineIndex]
  const letterIndex = line.search(/[a-zа-яёіїєґ]/i)
  const capitalized =
    line.slice(0, letterIndex) +
    line[letterIndex].toUpperCase() +
    line.slice(letterIndex + 1)

  return [
    ...lines.slice(0, lineIndex),
    capitalized,
    ...lines.slice(lineIndex + 1),
  ]
}

export function stripPunctuation(lines: string[]): string[] {
  return lines
    .map((line) =>
      line
        .replace(PUNCTUATION_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter((line) => line.length > 0)
}

export function stripLinks(lines: string[]): string[] {
  return lines
    .map((line) =>
      line
        .replace(URL_PATTERN, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter((line) => line.length > 0)
}
