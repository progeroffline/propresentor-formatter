import { Moon, Sun } from "lucide-react"

import { useLocale } from "@/components/locale-provider"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { strings } = useLocale()
  const isDark = resolvedTheme === "dark"

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Moon /> : <Sun />}
          </Button>
        }
      />
      <TooltipContent>
        {isDark ? strings.header.theme.dark : strings.header.theme.light}
      </TooltipContent>
    </Tooltip>
  )
}
