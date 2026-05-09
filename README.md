# BB Notes

BB Notes is a local-first songwriting workspace built for independent artists, writers, and creatives.

The goal is simple:

> capture ideas before they disappear.

BB Notes helps organize:
- hooks
- verses
- concepts
- unfinished drafts
- beat references
- songwriting metadata

inside a calm, minimal writing environment.

---

## Current MVP Features

- Create notes
- Edit notes
- Search notes
- Song metadata fields
- Local in-memory state
- Dark minimal studio-inspired UI

Planned:
- localStorage persistence
- export backups
- note deletion
- component refactors
- optional cloud sync

---

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- App Router

---

## Design Direction

BB Notes is intentionally designed to feel:
- calm
- focused
- minimal
- distraction-free

Inspired by:
- VS Code
- Apple Notes
- late-night songwriting sessions
- modern creative tooling

---

## Project Structure

```txt
src/
  app/
    page.tsx

  components/
    notes/

  data/
    starterNotes.ts

  types/
    note.ts
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Development Goals

Current focus:
- clean architecture
- fast iteration
- local-first workflow
- elegant UX
- deploy early / refactor gradually

---

## Notes

This project is intentionally being built in small MVP iterations instead of overengineering early infrastructure.

The current priority is:
1. shipping
2. workflow clarity
3. maintainability
4. product feel
5. gradual scalability