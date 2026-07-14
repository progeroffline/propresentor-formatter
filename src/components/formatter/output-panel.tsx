import { useLocale } from "@/components/locale-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Kbd } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { FormatSlide } from "@/lib/format-lyrics"

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

  return (
    <Card className="flex min-h-0 flex-col">
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
            <TooltipContent>
              {strings.output.copyTooltip}
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>C</Kbd>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        {sections.length > 0 && (
          <SectionBadges
            label={strings.output.sectionsLabel}
            sections={sections}
          />
        )}

        <ScrollArea className="min-h-0 flex-1 rounded-2xl border bg-input/30">
          {slides.length > 0 ? (
            <div className="flex flex-col gap-3 p-4">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10"
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

                  {slide.header && (
                    <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                      {slide.header}
                    </span>
                  )}
                </div>
              ))}
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
