import { useLocale } from "@/components/locale-provider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function OptionsBar({
  capitalizeSlides,
  onCapitalizeSlidesChange,
  removePunctuation,
  onRemovePunctuationChange,
  removeLinks,
  onRemoveLinksChange,
}: {
  capitalizeSlides: boolean
  onCapitalizeSlidesChange: (value: boolean) => void
  removePunctuation: boolean
  onRemovePunctuationChange: (value: boolean) => void
  removeLinks: boolean
  onRemoveLinksChange: (value: boolean) => void
}) {
  const { strings } = useLocale()

  return (
    <div className="flex flex-wrap items-center gap-4 border-b px-4 py-3 sm:px-6">
      <Label className="text-muted-foreground">{strings.options.label}</Label>

      <div className="flex items-center gap-2">
        <Switch
          id="capitalize-slides"
          checked={capitalizeSlides}
          onCheckedChange={onCapitalizeSlidesChange}
        />
        <Label htmlFor="capitalize-slides">
          {strings.options.capitalizeSlides}
        </Label>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex items-center gap-2">
        <Switch
          id="remove-punctuation"
          checked={removePunctuation}
          onCheckedChange={onRemovePunctuationChange}
        />
        <Label htmlFor="remove-punctuation">
          {strings.options.removePunctuation}
        </Label>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex items-center gap-2">
        <Switch
          id="remove-links"
          checked={removeLinks}
          onCheckedChange={onRemoveLinksChange}
        />
        <Label htmlFor="remove-links">{strings.options.removeLinks}</Label>
      </div>
    </div>
  )
}
