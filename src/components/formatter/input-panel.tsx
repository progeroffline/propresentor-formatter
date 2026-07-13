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

export function InputPanel({
  value,
  onValueChange,
  onClear,
  onFormat,
}: {
  value: string
  onValueChange: (value: string) => void
  onClear: () => void
  onFormat: () => void
}) {
  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{strings.input.title}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm" onClick={onClear}>
                  {strings.input.clear}
                </Button>
              }
            />
            <TooltipContent>{strings.input.clearTooltip}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="default" size="sm" onClick={onFormat}>
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
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={strings.input.placeholder}
          className="h-full font-mono"
        />
      </CardContent>
    </Card>
  )
}
