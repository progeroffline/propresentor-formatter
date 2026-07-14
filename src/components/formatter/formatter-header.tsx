import { useLocale } from "@/components/locale-provider"
import { Badge } from "@/components/ui/badge"

import { LanguageToggle } from "./language-toggle"
import { ThemeToggle } from "./theme-toggle"

export function FormatterHeader() {
  const { strings } = useLocale()

  return (
    <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
      <img src="/xecu-logotype.png" alt="" className="h-8 w-auto rounded-sm" />
      <h1 className="font-heading text-lg font-semibold">
        {strings.header.title}
      </h1>
      <Badge variant="secondary">{strings.header.tagline}</Badge>

      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
