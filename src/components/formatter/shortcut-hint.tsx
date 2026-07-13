import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function ShortcutHint({
  label,
  keys,
}: {
  label: string
  keys: string[]
}) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <KbdGroup>
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </KbdGroup>
    </span>
  )
}
