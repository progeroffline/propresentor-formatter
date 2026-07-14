# ProPresenter Lyrics Formatter

**English** | [Русский](README.ru.md) | [Українська](README.uk.md)

A fast, client-only tool that reformats pasted song lyrics into ProPresenter's slide format — sections are detected automatically, formatting options are optional, and the result is ready to paste straight into ProPresenter.

## What it does

- Paste raw lyrics from anywhere (lyric sites, chat, documents) — no particular formatting required.
- Automatically detects section headers — **Verse, Chorus, Bridge, PreChorus, Tag, Intro, Ending, Outro, Interlude, Vamp, Turnaround, Blank** — recognized in English, Russian, and Ukrainian, including common aliases, typos, and mixed-script variants.
- Headers don't need blank lines around them: works just as well with lyrics pasted as one continuous block, with no gaps between sections.
- Splits lyrics into slides on every line break — one lyric line becomes one ProPresenter slide.
- Optional per-slide formatting: capitalize the first letter, strip punctuation, strip links.
- A leading, unlabeled block (typically the song title/author) is automatically prefixed with `Title: ` in the copied output, once the song has at least one recognized section.
- Live preview renders every slide as its own card, with a border colored by its section (Verse in blue tones, Chorus in magenta/red, Bridge in purple, and so on) and the section name shown on each card — so you can see at a glance whether the song was split correctly.
- Everything runs in your browser. No backend, no accounts, nothing is uploaded anywhere.

## Getting started

```bash
npm install
npm run dev         # start the dev server
npm run build        # type-check and build for production
npm run test          # run the test suite
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run format         # prettier --write
```

## Tech stack

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (style: `base-rhea`)
- [Vitest](https://vitest.dev/)

## Adding UI components

This project uses shadcn/ui — add new components via the CLI rather than hand-writing them:

```bash
npx shadcn@latest add button
```

Import them as usual:

```tsx
import { Button } from "@/components/ui/button"
```
