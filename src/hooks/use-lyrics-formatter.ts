import * as React from "react"
import { toast } from "sonner"

import { useLocale } from "@/components/locale-provider"
import { formatLyrics, type FormatResult } from "@/lib/format-lyrics"

const EMPTY_RESULT: FormatResult = {
  output: "",
  sections: [],
  slideCount: 0,
  slides: [],
}

export function useLyricsFormatter() {
  const { strings } = useLocale()
  const [inputText, setInputText] = React.useState("")
  const [capitalizeSlides, setCapitalizeSlides] = React.useState(true)
  const [removePunctuation, setRemovePunctuation] = React.useState(true)
  const [removeLinks, setRemoveLinks] = React.useState(true)

  const [formatResult, setFormatResult] =
    React.useState<FormatResult>(EMPTY_RESULT)

  const format = React.useCallback(() => {
    setFormatResult(
      formatLyrics(inputText, { capitalizeSlides, removePunctuation, removeLinks })
    )
  }, [inputText, capitalizeSlides, removePunctuation, removeLinks])

  const clear = React.useCallback(() => {
    setInputText("")
    setFormatResult(EMPTY_RESULT)
  }, [])

  const copy = React.useCallback(() => {
    if (!formatResult.output) {
      return
    }

    navigator.clipboard.writeText(formatResult.output).then(
      () => toast.success(strings.output.copiedToast),
      () => toast.error(strings.output.copyFailedToast)
    )
  }, [formatResult.output, strings])

  return {
    inputText,
    setInputText,
    capitalizeSlides,
    setCapitalizeSlides,
    removePunctuation,
    setRemovePunctuation,
    removeLinks,
    setRemoveLinks,
    outputText: formatResult.output,
    sections: formatResult.sections,
    slideCount: formatResult.slideCount,
    slides: formatResult.slides,
    format,
    clear,
    copy,
  }
}
