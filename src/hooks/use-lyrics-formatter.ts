import * as React from "react"
import { toast } from "sonner"

import { useLocale } from "@/components/locale-provider"
import { formatLyrics } from "@/lib/format-lyrics"

export function useLyricsFormatter() {
  const { strings } = useLocale()
  const [inputText, setInputText] = React.useState("")
  const [capitalizeSlides, setCapitalizeSlides] = React.useState(true)
  const [removePunctuation, setRemovePunctuation] = React.useState(true)
  const [removeLinks, setRemoveLinks] = React.useState(true)

  const [outputText, setOutputText] = React.useState("")
  const [sections, setSections] = React.useState<string[]>([])
  const [slideCount, setSlideCount] = React.useState(0)

  const format = React.useCallback(() => {
    const result = formatLyrics(inputText, {
      capitalizeSlides,
      removePunctuation,
      removeLinks,
    })
    setOutputText(result.output)
    setSections(result.sections)
    setSlideCount(result.slideCount)
  }, [inputText, capitalizeSlides, removePunctuation, removeLinks])

  const clear = React.useCallback(() => {
    setInputText("")
    setOutputText("")
    setSections([])
    setSlideCount(0)
  }, [])

  const copy = React.useCallback(() => {
    if (!outputText) {
      return
    }

    void navigator.clipboard.writeText(outputText)
    toast.success(strings.output.copiedToast)
  }, [outputText, strings])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey && !event.metaKey) {
        return
      }

      if (event.key === "Enter") {
        event.preventDefault()
        format()
        return
      }

      if (event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault()
        copy()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [format, copy])

  return {
    inputText,
    setInputText,
    capitalizeSlides,
    setCapitalizeSlides,
    removePunctuation,
    setRemovePunctuation,
    removeLinks,
    setRemoveLinks,
    outputText,
    sections,
    slideCount,
    format,
    clear,
    copy,
  }
}
