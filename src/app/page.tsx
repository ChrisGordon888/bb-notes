"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { starterNotes } from "@/data/starterNotes";
import { templates, type TemplateType } from "@/data/templates";
import { loadNotes, saveNotes } from "@/lib/storage";
import type { Note } from "@/types/note";
import { exportNotes } from "@/lib/exportNotes";
import { importNotes } from "@/lib/importNotes";
import NotesSidebar from "@/components/notes/NotesSidebar";
import NoteEditor from "@/components/notes/NoteEditor";
import MetadataBar from "@/components/notes/MetadataBar";
import CollapsedSidebar from "@/components/notes/CollapsedSidebar";

const SIDEBAR_STORAGE_KEY = "bb-notes-sidebar-collapsed";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(starterNotes);
  const [activeNoteId, setActiveNoteId] = useState(starterNotes[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoadedSidebarState, setHasLoadedSidebarState] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedNotes = loadNotes();

    if (savedNotes) {
      setNotes(savedNotes);
      setActiveNoteId(savedNotes[0]?.id ?? "");
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const savedSidebarState = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);

    if (savedSidebarState === "true") {
      setIsSidebarCollapsed(true);
    }

    setHasLoadedSidebarState(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    saveNotes(notes);
  }, [notes, hasLoaded]);

  useEffect(() => {
    if (!hasLoadedSidebarState) return;

    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed, hasLoadedSidebarState]);

  const activeNote = notes.find((note) => note.id === activeNoteId);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const searchableText =
          `${note.title} ${note.body} ${note.section} ${note.vibe}`.toLowerCase();

        return searchableText.includes(search.toLowerCase());
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [notes, search]);

  function createNote(templateType: TemplateType = "blank") {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      body: templates[templateType],
      section: "Concept",
      bpm: "",
      musicalKey: "",
      vibe: "",
      beatLink: "",
      updatedAt: new Date().toISOString(),
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setActiveNoteId(newNote.id);
    setIsFocusMode(false);
  }

  function updateActiveNote(updates: Partial<Note>) {
    if (!activeNote) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === activeNote.id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  }

  function deleteNote(noteId: string) {
    const shouldDelete = window.confirm(
      "Delete this note? This cannot be undone unless you have an exported backup."
    );

    if (!shouldDelete) return;

    const remainingNotes = notes.filter((note) => note.id !== noteId);

    setNotes(remainingNotes);

    if (activeNoteId === noteId) {
      setActiveNoteId(remainingNotes[0]?.id ?? "");
      setIsFocusMode(false);
    }
  }

  async function handleImportBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const importedNotes = await importNotes(file);

    if (!importedNotes) {
      alert("Invalid backup file.");
      return;
    }

    setNotes(importedNotes);
    setActiveNoteId(importedNotes[0]?.id ?? "");
    setIsFocusMode(false);

    event.target.value = "";
  }

  function formatLastSaved(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <main className="h-screen overflow-hidden bg-[#0F1115] text-[#E8E6E3]">
      <div className="flex h-full">
        {!isFocusMode &&
          (isSidebarCollapsed ? (
            <CollapsedSidebar onExpand={() => setIsSidebarCollapsed(false)} />
          ) : (
            <NotesSidebar
              notes={filteredNotes}
              activeNoteId={activeNoteId}
              search={search}
              setSearch={setSearch}
              createNote={createNote}
              deleteNote={deleteNote}
              setActiveNoteId={setActiveNoteId}
              exportBackup={() => exportNotes(notes)}
              importBackup={handleImportBackup}
              onCollapse={() => setIsSidebarCollapsed(true)}
            />
          ))}

        <section className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#171A21] px-4 py-3">
            {activeNote ? (
              <button className="rounded-lg bg-[#20242D] px-4 py-2 text-sm">
                {activeNote.title || "Untitled Note"}
              </button>
            ) : (
              <p className="text-sm text-zinc-500">No note selected</p>
            )}

            {activeNote && (
              <button
                onClick={() => setIsFocusMode((current) => !current)}
                className="ml-auto rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-[#20242D]"
              >
                {isFocusMode ? "Exit Focus" : "Focus Mode"}
              </button>
            )}
          </div>

          {activeNote ? (
            <>
              <NoteEditor
                activeNote={activeNote}
                updateActiveNote={updateActiveNote}
              />

              {!isFocusMode && (
                <MetadataBar
                  activeNote={activeNote}
                  formatLastSaved={formatLastSaved}
                />
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-zinc-500">
              <p>Create a new note to begin.</p>

              <button
                onClick={() => createNote("blank")}
                className="mt-4 rounded-xl bg-[#7C72FF] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                + New Note
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}