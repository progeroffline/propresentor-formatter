import { toast } from "sonner"

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

import { OUTPUT_PLACEHOLDER, SECTIONS } from "./placeholder-data"
import { SectionBadges } from "./section-badges"

export function OutputPanel() {
  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Output — Ready for ProPresenter</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            12 slides
          </Badge>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Copied to clipboard")}
                >
                  Copy
                </Button>
              }
            />
            <TooltipContent>
              Copy formatted output
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>C</Kbd>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <SectionBadges sections={SECTIONS} />

        <ScrollArea className="min-h-0 flex-1 rounded-2xl border bg-input/30">
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
            {OUTPUT_PLACEHOLDER}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
