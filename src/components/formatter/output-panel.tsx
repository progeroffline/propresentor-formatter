import { useLocale } from "@/components/locale-provider"
import { useTheme } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { FormatSlide } from "@/lib/format-lyrics"
import { getSectionColor, hexToRgba } from "@/lib/section-colors"

import { SectionBadges } from "./section-badges"

export function OutputPanel({
  slides,
  slideCount,
  sections,
  onCopy,
}: {
  slides: FormatSlide[]
  slideCount: number
  sections: string[]
  onCopy: () => void
}) {
  const { strings } = useLocale()
  const { resolvedTheme } = useTheme()

  return (
    <Card className="flex flex-col lg:min-h-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{strings.output.title}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {strings.output.slideCount(slideCount)}
          </Badge>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm" onClick={onCopy}>
                  {strings.output.copy}
                </Button>
              }
            />
            <TooltipContent>{strings.output.copyTooltip}</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        {sections.length > 0 && (
          <SectionBadges
            label={strings.output.sectionsLabel}
            sections={sections}
          />
        )}

        <ScrollArea className="rounded-2xl border bg-input/30 lg:min-h-0 lg:flex-1">
          {slides.length > 0 ? (
            <div className="flex flex-col gap-3 p-4">
              {slides.map((slide, index) => {
                const color = getSectionColor(slide.header)
                const tintBackground =
                  color && resolvedTheme === "light"
                    ? hexToRgba(color, 0.1)
                    : undefined

                return (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border-2 bg-card p-4 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10"
                    style={{
                      borderColor: color,
                      backgroundColor: tintBackground,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      {slide.isTitle ? (
                        <p className="text-center font-heading text-lg font-semibold whitespace-pre-wrap">
                          {slide.lines.join("\n")}
                        </p>
                      ) : (
                        <pre className="font-mono text-sm whitespace-pre-wrap">
                          {slide.lines.join("\n")}
                        </pre>
                      )}
                    </div>

                    {slide.headerLabel && (
                      <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                        {slide.headerLabel}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="p-4 font-mono text-sm text-muted-foreground">
              {strings.output.emptyState}
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
