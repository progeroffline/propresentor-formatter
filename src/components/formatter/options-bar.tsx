import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function OptionsBar() {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b px-4 py-3 sm:px-6">
      <Label className="text-muted-foreground">Options</Label>

      <div className="flex items-center gap-2">
        <Checkbox id="capitalize-slides" />
        <Label htmlFor="capitalize-slides">
          Capitalize first letter of each slide
        </Label>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex items-center gap-2">
        <Checkbox id="remove-punctuation" />
        <Label htmlFor="remove-punctuation">Remove punctuation</Label>
      </div>
    </div>
  )
}
