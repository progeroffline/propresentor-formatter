import type { AppStrings } from "../types"

import { pluralizeRu } from "./pluralize-ru"

const SONG_PLACEHOLDER = `Я спасён от огня (Алексей Заханеко)

Куплет 1
Я не знал Тебя
Я не знал про Твой крест
Я не знал Тебя
Я не знал, что Ты есть
Ты один такой
И нет другого, как Ты
Ты один такой
Я хочу быть как Ты

Припев
Я спасён от огня
Я люблю Тебя
Я спасён от огня
О, Иисус, Ты жизнь моя

Куплет 2
Ты пришёл ко мне
Утешить сердце моё
Ты пришёл ко мне
И дал свободу свою
Ты пришёл ко мне
Дал любовь свою
Ты пришёл ко мне
И спас душу мою

Припев
Я спасён от огня
Я люблю Тебя
Я спасён от огня
О, Иисус, Ты жизнь моя`

export const ru: AppStrings = {
  header: {
    title: "ProPresenter Formatter",
    tagline: "Текст песни → Буфер обмена",
    theme: {
      light: "Светлая тема",
      dark: "Тёмная тема",
    },
  },
  options: {
    label: "Опции",
    capitalizeSlides: "Заглавная буква в начале каждого слайда",
    removePunctuation: "Убрать знаки препинания",
    removeLinks: "Убрать ссылки",
  },
  input: {
    title: "Ввод",
    clear: "Очистить",
    clearTooltip: "Очистить поле ввода",
    format: "Форматировать ↗",
    formatTooltip: "Разбить текст песни на слайды",
    placeholder: SONG_PLACEHOLDER,
  },
  output: {
    title: "Вывод — готово для ProPresenter",
    slideCount: (count) =>
      `${count} ${pluralizeRu(count, "слайд", "слайда", "слайдов")}`,
    copy: "Копировать",
    copyTooltip: "Скопировать результат",
    copiedToast: "Скопировано в буфер обмена",
    sectionsLabel: "Разделы:",
    emptyState: "Здесь появится результат форматирования",
  },
  footer: {
    status: "Готово",
    contactText: "Если есть вопросы, пишите в Telegram",
    contactHandle: "@paydevvv",
    contactUrl: "https://t.me/paydevvv",
  },
}
