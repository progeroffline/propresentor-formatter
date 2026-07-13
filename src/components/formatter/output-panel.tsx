import { toast } from "sonner"

import { strings } from "@/i18n"

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

import { SectionBadges } from "./section-badges"

export function OutputPanel() {
  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{strings.output.title}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {strings.output.slideCount}
          </Badge>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(strings.output.copiedToast)}
                >
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
        <SectionBadges
          label={strings.output.sectionsLabel}
          sections={strings.output.sections}
        />

        <ScrollArea className="min-h-0 flex-1 rounded-2xl border bg-input/30">
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
            {strings.output.placeholder}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
