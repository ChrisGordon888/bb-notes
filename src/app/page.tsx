"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
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

type MobileView = "notes" | "editor";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState("");
  const [search, setSearch] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoadedSidebarState, setHasLoadedSidebarState] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("notes");

  useEffect(() => {
    const savedNotes = loadNotes();

    if (savedNotes) {
      setNotes(savedNotes);
      setActiveNoteId(savedNotes[0]?.id ?? "");
      setMobileView(savedNotes.length > 0 ? "editor" : "notes");
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

  function selectNote(noteId: string) {
    setActiveNoteId(noteId);
    setMobileView("editor");
  }

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
    setMobileView("editor");
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
      setMobileView(remainingNotes.length > 0 ? "editor" : "notes");
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
    setMobileView(importedNotes.length > 0 ? "editor" : "notes");

    event.target.value = "";
  }

  function formatLastSaved(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const shouldShowSidebar =
    !isFocusMode && (mobileView === "notes" || typeof window === "undefined");

  return (
    <main className="h-screen overflow-hidden bg-[#0F1115] text-[#E8E6E3]">
      <div className="flex h-full">
        {!isFocusMode && (
          <>
            <div className={`${mobileView === "notes" ? "flex" : "hidden"} h-full w-full sm:hidden`}>
              <NotesSidebar
                notes={filteredNotes}
                activeNoteId={activeNoteId}
                search={search}
                setSearch={setSearch}
                createNote={createNote}
                deleteNote={deleteNote}
                setActiveNoteId={selectNote}
                exportBackup={() => exportNotes(notes)}
                importBackup={handleImportBackup}
                onCollapse={() => setIsSidebarCollapsed(true)}
              />
            </div>

            <div className="hidden h-full sm:flex">
              {isSidebarCollapsed ? (
                <CollapsedSidebar
                  onExpand={() => setIsSidebarCollapsed(false)}
                />
              ) : (
                <NotesSidebar
                  notes={filteredNotes}
                  activeNoteId={activeNoteId}
                  search={search}
                  setSearch={setSearch}
                  createNote={createNote}
                  deleteNote={deleteNote}
                  setActiveNoteId={selectNote}
                  exportBackup={() => exportNotes(notes)}
                  importBackup={handleImportBackup}
                  onCollapse={() => setIsSidebarCollapsed(true)}
                />
              )}
            </div>
          </>
        )}

        <section
          className={`flex flex-1 flex-col ${
            mobileView === "editor" || isFocusMode ? "flex" : "hidden"
          } sm:flex`}
        >
          <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#171A21] px-4 py-3">
            {mobileView === "editor" && !isFocusMode && (
              <button
                onClick={() => setMobileView("notes")}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-[#20242D] sm:hidden"
              >
                ← Notes
              </button>
            )}

            {activeNote ? (
              <button className="rounded-lg bg-[#20242D] px-4 py-2 text-sm">
                {activeNote.title || "Untitled Note"}
              </button>
            ) : (
              <p className="text-sm text-zinc-500">BB Notes</p>
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
            <div className="flex flex-1 items-center justify-center px-6 text-center">
              <div className="max-w-xl rounded-3xl border border-zinc-800 bg-[#11151C]/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#7C72FF]">
                  Local-first songwriting workspace
                </p>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-100">
                  Capture hooks, verses, concepts, and song structures.
                </h1>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  BB Notes saves drafts locally in your browser. No account,
                  no backend, no setup — just a focused writing space for rough
                  creative ideas.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={() => createNote("blank")}
                    className="rounded-xl bg-[#7C72FF] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Start Blank
                  </button>

                  <button
                    onClick={() => createNote("songStructureV1")}
                    className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-[#20242D]"
                  >
                    Use Song Template
                  </button>
                </div>

                <p className="mt-5 text-xs text-zinc-600">
                  Tip: export backups anytime to keep your lyrics safe.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}