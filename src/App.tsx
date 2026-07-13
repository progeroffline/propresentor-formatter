import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const INPUT_PLACEHOLDER = `Verse 1
Amazing grace, how sweet the sound
That saved a wretch like me

Chorus
I once was lost, but now am found
Was blind, but now I see

Verse 2
'Twas grace that taught my heart to fear
And grace my fears relieved`

const OUTPUT_PLACEHOLDER = `Verse 1
Amazing grace, how sweet the sound
That saved a wretch like me

Chorus
I once was lost, but now am found
Was blind, but now I see

Verse 2
'Twas grace that taught my heart to fear
And grace my fears relieved`

const SECTIONS = ["Verse 1", "Chorus", "Verse 2", "Bridge"]

export function App() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col bg-background">
        <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
          <h1 className="font-heading text-lg font-semibold">
            ProPresenter Formatter
          </h1>
          <Badge variant="secondary">Lyrics → Clipboard</Badge>
        </header>

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

        <main className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 sm:px-6 lg:grid-cols-2">
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

          <Card className="flex min-h-0 flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Output — Ready for ProPresenter</CardTitle>
              <CardAction className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  12 slides
                </Badge>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success("Copied to clipboard")}
                      >
                        Copy
                      </Button>
                    }
                  />
                  <TooltipContent>
                    Copy formatted output
                    <Kbd>Ctrl</Kbd>
                    <Kbd>Shift</Kbd>
                    <Kbd>C</Kbd>
                  </TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sections:</span>
                {SECTIONS.map((section) => (
                  <Badge key={section} variant="secondary">
                    {section}
                  </Badge>
                ))}
              </div>

              <ScrollArea className="min-h-0 flex-1 rounded-2xl border bg-input/30">
                <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                  {OUTPUT_PLACEHOLDER}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:px-6">
          <span>Ready</span>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              Format
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Enter</Kbd>
              </KbdGroup>
            </span>

            <span className="flex items-center gap-1.5">
              Copy
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>C</Kbd>
              </KbdGroup>
            </span>
          </div>
        </footer>
      </div>

      <Toaster />
    </TooltipProvider>
  )
}

export default App
