import { strings } from "@/i18n"

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

export function InputPanel() {
  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{strings.input.title}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  {strings.input.clear}
                </Button>
              }
            />
            <TooltipContent>{strings.input.clearTooltip}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="default" size="sm">
                  {strings.input.format}
                </Button>
              }
            />
            <TooltipContent>
              {strings.input.formatTooltip}
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        <Textarea
          placeholder={strings.input.placeholder}
          className="h-full font-mono"
        />
      </CardContent>
    </Card>
  )
}
