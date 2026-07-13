import { strings } from "@/i18n"

export function FormatterFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
      <span>{strings.footer.status}</span>

      <span>
        {strings.footer.contactText}{" "}
        <a
          href={strings.footer.contactUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          {strings.footer.contactHandle}
        </a>
      </span>
    </footer>
  )
}
