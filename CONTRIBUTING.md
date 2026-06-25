# Contributing & Authoring Guide

This curriculum is plain HTML — no build step. Keep new and edited material
consistent with the conventions below so the four-document weekly package stays
coherent and translatable.

## Weekly package

Every `Week_<N>_Spanish_Lesson/` folder must contain exactly four files:

- `spanish_week_<N>_lesson_plan.html`
- `spanish_week_<N>_workbook.html`
- `spanish_week_<N>_answer_sheet.html`
- `spanish_week_<N>_supplemental_vocabulary_list.html`

Each page `<head>` must load the shared assets:

```html
<link rel="stylesheet" href="../styles/weekly-shared.css">
<script src="../styles/weekly-shared.js" defer></script>
```

(Use `../../styles/...` for files under `tw/`.) `weekly-shared.js` enhances
tables and injects the English ⇄ 繁體中文 page toggle, so it must be present.

## Lesson-plan quality bar (avoid templating)

Each of the five day cards (`id="day-1"` … `id="day-5"`) is a distinct lesson.
Do **not** copy the same block across days. In particular:

- **Grammar Discovery** — a real mini-lesson for *that day's* focus: the rule in
  plain English, 1–2 worked Spanish examples, and one common learner error.
  Use a small conjugation/contrast `<table>` where it helps.
- **Free Production** — a task that is distinct per day and escalates across the
  week.
- **Real-World Simulation** — a different scenario each day, tied to the focus.
- **Vocabulary Table** — day-relevant words with specific usage notes in the
  third column ("Use / Pattern"), not a generic placeholder.

These phrases are banned (they mark the old boilerplate) and the consistency
check fails on them: `Identify target pattern`, `High-frequency week target`.

## Translations (`tw/` = Traditional Chinese, Taiwan)

- Mirror the English source structure exactly: same sections, order, `id`s,
  `day-nav` blocks, `page-break`s, and tables.
- `<html lang="zh-Hant">`, plus `canonical` and bidirectional `hreflang`
  (`en` / `zh-Hant`) links pointing at the matching EN and TW URLs.
- **Translate**: headings, instructions, table header cells, English glosses,
  vocabulary notes, Grammar Discovery prose, can-do statements, reading
  questions, and task/test instructions.
- **Keep in Spanish** (it is the language being learned): dialogues, fill-in
  stems, example sentences, word banks, scramble items, and the Spanish answers
  in answer sheets. Translation-drill items keep their original language.

## Before you commit

```bash
bash scripts/check_consistency.sh
```

Update `index.html` (and `tw/index.html`) whenever weeks are added, renamed, or
reorganized.
