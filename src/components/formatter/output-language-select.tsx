import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OutputLanguage } from "@/lib/format-lyrics"

const OUTPUT_LANGUAGES: {
  value: OutputLanguage
  flag: string
  name: string
}[] = [
  { value: "en", flag: "🇬🇧", name: "English" },
  { value: "ru", flag: "🇷🇺", name: "Русский" },
  { value: "uk", flag: "🇺🇦", name: "Українська" },
  { value: "de", flag: "🇩🇪", name: "Deutsch" },
]

const OUTPUT_LANGUAGE_BY_VALUE = new Map(
  OUTPUT_LANGUAGES.map((language) => [language.value, language])
)

export function OutputLanguageSelect({
  value,
  onValueChange,
  label,
}: {
  value: OutputLanguage
  onValueChange: (value: OutputLanguage) => void
  label: string
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OutputLanguage)}
    >
      <SelectTrigger size="sm" aria-label={label}>
        <SelectValue>
          {(selected: OutputLanguage) => {
            const language = OUTPUT_LANGUAGE_BY_VALUE.get(selected)
            return (
              <>
                <span aria-hidden="true">{language?.flag}</span>
                {language?.name}
              </>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OUTPUT_LANGUAGES.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            <span aria-hidden="true">{language.flag}</span>
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
