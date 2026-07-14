// Border colors used to visually group slide cards by section in the
// output preview, so a glance at the outline confirms the parser split
// the song into the right sections. Numbered variants without an explicit
// override fall back to their group's base color.
const BASE_COLORS: Record<string, string> = {
  Verse: "#3B82C4",
  Chorus: "#D63A6B",
  Bridge: "#7B2FD6",
  PreChorus: "#B83A9E",
  Tag: "#D64A3B",
  Intro: "#B8A83B",
  Ending: "#9C8A2F",
  Outro: "#8C9C3B",
  Interlude: "#4CAF6B",
  Vamp: "#52B36F",
  Turnaround: "#5FBF7A",
  Blank: "#000000",
}

const NUMBERED_OVERRIDES: Record<string, string> = {
  "Verse 2": "#4A90D9",
  "Verse 3": "#2D5F8A",
  "Verse 6": "#1E3A5F",
  "Chorus 2": "#C23759",
  "Chorus 3": "#8B2942",
  "Bridge 1": "#8A3AE0",
  "Bridge 2": "#5B1FA8",
  "Bridge 3": "#3D1470",
}

export function getSectionColor(header: string | null): string | undefined {
  if (!header) {
    return undefined
  }

  if (header in NUMBERED_OVERRIDES) {
    return NUMBERED_OVERRIDES[header]
  }

  const canonical = header.replace(/\s+\d+$/, "")
  return BASE_COLORS[canonical]
}

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "")
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
