import { ShortcutHint } from "./shortcut-hint"

export function FormatterFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
      <span>Ready</span>

      <div className="flex flex-wrap items-center gap-4">
        <ShortcutHint label="Format" keys={["Ctrl", "Enter"]} />
        <ShortcutHint label="Copy" keys={["Ctrl", "Shift", "C"]} />
      </div>
    </footer>
  )
}
