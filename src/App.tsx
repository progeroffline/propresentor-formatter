import { FormatterFooter } from "@/components/formatter/formatter-footer"
import { FormatterHeader } from "@/components/formatter/formatter-header"
import { InputPanel } from "@/components/formatter/input-panel"
import { OptionsBar } from "@/components/formatter/options-bar"
import { OutputPanel } from "@/components/formatter/output-panel"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function App() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh flex-col bg-background">
        <FormatterHeader />
        <OptionsBar />

        <main className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 sm:px-6 lg:grid-cols-2">
          <InputPanel />
          <OutputPanel />
        </main>

        <FormatterFooter />
      </div>

      <Toaster />
    </TooltipProvider>
  )
}

export default App
