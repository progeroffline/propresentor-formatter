import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Kbd } from "@/components/ui/kbd"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { INPUT_PLACEHOLDER } from "./placeholder-data"

export function InputPanel() {
  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Input</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  Clear
                </Button>
              }
            />
            <TooltipContent>Clear the input field</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="default" size="sm">
                  Format ↗
                </Button>
              }
            />
            <TooltipContent>
              Format lyrics into slides
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        <Textarea
          placeholder={INPUT_PLACEHOLDER}
          className="h-full font-mono"
        />
      </CardContent>
    </Card>
  )
}
