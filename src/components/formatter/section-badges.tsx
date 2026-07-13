import { Badge } from "@/components/ui/badge"

export function SectionBadges({ sections }: { sections: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sections:</span>
      {sections.map((section) => (
        <Badge key={section} variant="secondary">
          {section}
        </Badge>
      ))}
    </div>
  )
}
