<div align="center">

# ProPresenter Lyrics Formatter

Paste raw song lyrics in. Get ProPresenter-ready, section-tagged slides out.

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![No backend](https://img.shields.io/badge/backend-none-9E9E9E)](#privacy)

**English** · [Русский](README.ru.md) · [Українська](README.uk.md)

</div>

---

## Contents

- [Why](#why)
- [Features](#features)
- [Supported sections](#supported-sections)
- [Formatting options](#formatting-options)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Tech stack](#tech-stack)
- [Adding UI components](#adding-ui-components)
- [Privacy](#privacy)

## Why

Copying lyrics into ProPresenter usually means manually retyping section headers, splitting text into slides one at a time, and cleaning up stray links or punctuation someone left in. This tool does that in one paste: drop in lyrics in whatever shape they arrive — from a lyric site, a group chat, a PDF export — and get back clean, section-tagged, slide-per-line text ready to paste straight into ProPresenter's arrangement editor.

## Features

**Automatic section detection** — recognizes section headers (Verse, Chorus, Bridge, and more) written in English, Russian, or Ukrainian, in whatever form they show up:

- Numbers before _or_ after the name — `Verse 2`, `2 Verse`, `Verse (2)`, `Verse II`
- Repeat markers stripped as decoration, not content — `Chorus x2`, `Припев х2`
- Common typos and mixed-keyboard-layout artifacts — e.g. `Teг` (Latin _T_/_e_ + Cyrillic _г_)
- Works even with **no blank lines** between sections — headers are recognized line by line, not just at the top of a paragraph, so a solid, gapless wall of pasted lyrics still splits correctly

**One line, one slide** — every lyric line becomes its own ProPresenter slide, matching how ProPresenter arrangements are normally built.

**Optional cleanup**, applied per slide:

- Capitalize the first letter
- Strip punctuation (commas, quotes, ellipses, and more)
- Strip `http(s)://` and `www.` links

**Automatic title slide** — a leading, unlabeled block (typically the song title and author) is prefixed with `Title: ` in the copied output, but only once the song has at least one recognized section, so a plain block of text isn't mislabeled.

**Color-coded live preview** — every slide renders as its own card in the output panel, bordered in a color tied to its section (Verse in blue tones, Chorus in magenta/red, Bridge in purple, and so on — see the [full table](#supported-sections)), with the section name shown on each card. One glance tells you whether the song was split the way you expected.

**Keyboard-first** — `Ctrl+Enter` to format, `Ctrl+Shift+C` to copy the result.

**Light & dark theme**, and a Russian/Ukrainian interface (see [Privacy](#privacy) for why there's no server involved at all).

## Supported sections

| Section    | English                      | Russian                                     | Ukrainian                          | Preview color                                        |
| ---------- | ---------------------------- | ------------------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| Verse      | `Verse`                      | `Куплет`                                    | `Куплет`                           | ![#3B82C4](https://img.shields.io/badge/-%20-3B82C4) |
| Chorus     | `Chorus`                     | `Припев`                                    | `Приспів`                          | ![#D63A6B](https://img.shields.io/badge/-%20-D63A6B) |
| Bridge     | `Bridge`                     | `Бридж`, `Мост`                             | `Брідж`                            | ![#7B2FD6](https://img.shields.io/badge/-%20-7B2FD6) |
| PreChorus  | `PreChorus`, `Pre Chorus`    | `Предприпев`, `Пред припев`, `Вставка`      | `Запев`, `Заспів`, `Перед приспів` | ![#B83A9E](https://img.shields.io/badge/-%20-B83A9E) |
| Tag        | `Tag`, `Coda`, `Post Chorus` | `Тег`, `Кода`, `Постприпев`, `Пост приспів` | `Тег`, `Кода`                      | ![#D64A3B](https://img.shields.io/badge/-%20-D64A3B) |
| Intro      | `Intro`                      | `Интро`                                     | `Інтро`                            | ![#B8A83B](https://img.shields.io/badge/-%20-B8A83B) |
| Ending     | `Ending`                     | `Концовка`                                  | `Кінцівка`                         | ![#9C8A2F](https://img.shields.io/badge/-%20-9C8A2F) |
| Outro      | `Outro`                      | `Аутро`                                     | `Аутро`                            | ![#8C9C3B](https://img.shields.io/badge/-%20-8C9C3B) |
| Interlude  | `Interlude`, `Instrumental`  | `Проигрыш`, `Инструментал`                  | `Програш`                          | ![#4CAF6B](https://img.shields.io/badge/-%20-4CAF6B) |
| Vamp       | `Vamp`                       | `Вамп`                                      | `Вамп`                             | ![#52B36F](https://img.shields.io/badge/-%20-52B36F) |
| Turnaround | `Turnaround`                 | `Переход`                                   | `Перехід`                          | ![#5FBF7A](https://img.shields.io/badge/-%20-5FBF7A) |
| Blank      | `Blank`                      | `Пусто`                                     | `Порожньо`                         | ![#000000](https://img.shields.io/badge/-%20-000000) |

Numbered sections (`Verse 2`, `Bridge 3`, ...) shade slightly differently within the same family so adjacent repeats of a section are easy to tell apart at a glance.

Matching is case-insensitive and works whether the header is written plainly on its own line (`Chorus`) or wrapped in brackets (`[Chorus]`).

## Formatting options

Three optional toggles, applied to every slide before it's split out:

| Option                | What it does                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Capitalize**        | Capitalizes the first letter of each slide (Cyrillic-aware — handles `і`/`ї`/`є`/`ґ` too).                                                                 |
| **Strip punctuation** | Removes commas, periods, quotes, `«»`, ellipses, and similar marks; a line that becomes empty is dropped entirely rather than left as a stray blank slide. |
| **Strip links**       | Removes `http(s)://` and `www.` URLs from a line; same drop-if-empty behavior.                                                                             |

## Getting started

Requires [Node.js](https://nodejs.org/) and npm.

```bash
git clone git@github.com:progeroffline/propresentor-formatter.git
cd propresentor-formatter
npm install
npm run dev
```

Open the printed local URL, paste in some lyrics, and press `Ctrl+Enter`.

## Available scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload      |
| `npm run build`     | Type-check (`tsc -b`) and build for production |
| `npm run preview`   | Preview the production build locally           |
| `npm run test`      | Run the Vitest test suite                      |
| `npm run lint`      | Run ESLint                                     |
| `npm run typecheck` | Type-check the project without emitting output |
| `npm run format`    | Format the codebase with Prettier              |

## Tech stack

| Layer         | Choice                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Framework     | [React 19](https://react.dev/)                                                                  |
| Language      | [TypeScript](https://www.typescriptlang.org/)                                                   |
| Build tool    | [Vite](https://vite.dev/)                                                                       |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/)                                                     |
| UI components | [shadcn/ui](https://ui.shadcn.com/) (style `base-rhea`, base color `zinc`, icons from `lucide`) |
| Testing       | [Vitest](https://vitest.dev/)                                                                   |

## Privacy

There is no backend. Parsing, formatting, and preview rendering all happen locally in your browser — nothing you paste is ever sent anywhere.

```

```
