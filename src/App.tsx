import { FormatterFooter } from "@/components/formatter/formatter-footer"
import { FormatterHeader } from "@/components/formatter/formatter-header"
import { InputPanel } from "@/components/formatter/input-panel"
import { OptionsBar } from "@/components/formatter/options-bar"
import { OutputPanel } from "@/components/formatter/output-panel"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useLyricsFormatter } from "@/hooks/use-lyrics-formatter"

export function App() {
  const formatter = useLyricsFormatter()

  return (
    <TooltipProvider>
      <div className="flex flex-col bg-background lg:h-svh lg:overflow-hidden">
        <FormatterHeader />
        <OptionsBar
          capitalizeSlides={formatter.capitalizeSlides}
          onCapitalizeSlidesChange={formatter.setCapitalizeSlides}
          removePunctuation={formatter.removePunctuation}
          onRemovePunctuationChange={formatter.setRemovePunctuation}
          removeLinks={formatter.removeLinks}
          onRemoveLinksChange={formatter.setRemoveLinks}
          outputLanguage={formatter.outputLanguage}
          onOutputLanguageChange={formatter.setOutputLanguage}
        />

        <main className="grid grid-cols-1 gap-4 p-4 sm:px-6 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:overflow-hidden">
          <InputPanel
            value={formatter.inputText}
            onValueChange={formatter.setInputText}
            onClear={formatter.clear}
            onFormat={formatter.format}
          />
          <OutputPanel
            slides={formatter.slides}
            slideCount={formatter.slideCount}
            sections={formatter.sections}
            onCopy={formatter.copy}
          />
        </main>

        <FormatterFooter />
      </div>

      <Toaster />
    </TooltipProvider>
  )
}

export default App
