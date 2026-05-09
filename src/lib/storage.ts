// src/lib/storage.ts

import type { Note } from "@/types/note";

const STORAGE_KEY = "bb-notes";

export function loadNotes(): Note[] | null {
  if (typeof window === "undefined") return null;

  const storedNotes = window.localStorage.getItem(STORAGE_KEY);

  if (!storedNotes) return null;

  try {
    return JSON.parse(storedNotes) as Note[];
  } catch {
    return null;
  }
}

export function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}