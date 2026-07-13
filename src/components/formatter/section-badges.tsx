import { Badge } from "@/components/ui/badge"

export function SectionBadges({
  label,
  sections,
}: {
  label: string
  sections: string[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {sections.map((section) => (
        <Badge key={section} variant="secondary">
          {section}
        </Badge>
      ))}
    </div>
  )
}
