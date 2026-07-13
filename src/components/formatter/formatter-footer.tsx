import { strings } from "@/i18n"

import { ShortcutHint } from "./shortcut-hint"

export function FormatterFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
      <span>{strings.footer.status}</span>

      <div className="flex flex-wrap items-center gap-4">
        <ShortcutHint
          label={strings.footer.formatShortcut}
          keys={["Ctrl", "Enter"]}
        />
        <ShortcutHint
          label={strings.footer.copyShortcut}
          keys={["Ctrl", "Shift", "C"]}
        />
      </div>
    </footer>
  )
}
