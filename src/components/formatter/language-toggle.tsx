import { Languages } from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n"

const LOCALE_ORDER = Object.keys(LOCALES) as Locale[]

export function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  const handleClick = () => {
    const nextIndex = (LOCALE_ORDER.indexOf(locale) + 1) % LOCALE_ORDER.length
    setLocale(LOCALE_ORDER[nextIndex])
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="sm" onClick={handleClick}>
            <Languages />
            {locale.toUpperCase()}
          </Button>
        }
      />
      <TooltipContent>{LOCALE_LABELS[locale]}</TooltipContent>
    </Tooltip>
  )
}
