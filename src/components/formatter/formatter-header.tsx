import { Badge } from "@/components/ui/badge"

import { ThemeToggle } from "./theme-toggle"

export function FormatterHeader() {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
      <h1 className="font-heading text-lg font-semibold">
        ProPresenter Formatter
      </h1>
      <Badge variant="secondary">Lyrics → Clipboard</Badge>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
