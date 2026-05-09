/*
|--------------------------------------------------------------------------
| BB NOTES — Main Workspace Page
|--------------------------------------------------------------------------
|
| Role of this page:
| - Owns temporary app state
| - Handles note creation, selection, editing, and search
| - Assembles the main layout
|
| Next refactor:
| - Move sidebar into components/notes/NotesSidebar.tsx
| - Move editor into components/notes/NoteEditor.tsx
| - Move bottom metadata into components/notes/MetadataBar.tsx
|
*/

"use client";

import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { starterNotes } from "@/data/starterNotes";
import { loadNotes, saveNotes } from "@/lib/storage";
import type { Note } from "@/types/note";
import { exportNotes } from "@/lib/exportNotes";
import { importNotes } from "@/lib/importNotes";
import NotesSidebar from "@/components/notes/NotesSidebar";

export default function Home() {
    const [notes, setNotes] = useState<Note[]>(starterNotes);
    const [activeNoteId, setActiveNoteId] = useState(starterNotes[0].id);
    const [search, setSearch] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const savedNotes = loadNotes();

        if (savedNotes) {
            setNotes(savedNotes);
            setActiveNoteId(savedNotes[0]?.id ?? "");
        }

        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (!hasLoaded) return;

        saveNotes(notes);
    }, [notes, hasLoaded]);

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

    function createNote() {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: "Untitled Note",
            body: "",
            section: "Concept",
            bpm: "",
            musicalKey: "",
            vibe: "",
            beatLink: "",
            updatedAt: new Date().toISOString(),
        };

        setNotes((currentNotes) => [newNote, ...currentNotes]);
        setActiveNoteId(newNote.id);
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
        }
    }

    async function handleImportBackup(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        const importedNotes = await importNotes(file);

        if (!importedNotes) {
            alert("Invalid backup file.");
            return;
        }

        setNotes(importedNotes);

        setActiveNoteId(importedNotes[0]?.id ?? "");
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
                />

                <section className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#171A21] px-4 py-3">
                        {activeNote ? (
                            <button className="rounded-lg bg-[#20242D] px-4 py-2 text-sm">
                                {activeNote.title || "Untitled Note"}
                            </button>
                        ) : (
                            <p className="text-sm text-zinc-500">No note selected</p>
                        )}
                    </div>

                    {activeNote ? (
                        <>
                            <div className="flex-1 overflow-y-auto p-8">
                                <input
                                    type="text"
                                    value={activeNote.title}
                                    onChange={(event) =>
                                        updateActiveNote({ title: event.target.value })
                                    }
                                    placeholder="Untitled Note"
                                    className="mb-6 w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-zinc-600"
                                />

                                <textarea
                                    value={activeNote.body}
                                    onChange={(event) =>
                                        updateActiveNote({ body: event.target.value })
                                    }
                                    placeholder="Hooks, verses, concepts, voice memo transcriptions..."
                                    className="h-[55vh] w-full resize-none bg-transparent text-lg leading-8 text-zinc-200 outline-none placeholder:text-zinc-600"
                                />

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <input
                                        value={activeNote.section}
                                        onChange={(event) =>
                                            updateActiveNote({ section: event.target.value })
                                        }
                                        placeholder="Section"
                                        className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
                                    />

                                    <input
                                        value={activeNote.bpm}
                                        onChange={(event) =>
                                            updateActiveNote({ bpm: event.target.value })
                                        }
                                        placeholder="BPM"
                                        className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
                                    />

                                    <input
                                        value={activeNote.musicalKey}
                                        onChange={(event) =>
                                            updateActiveNote({ musicalKey: event.target.value })
                                        }
                                        placeholder="Key"
                                        className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
                                    />

                                    <input
                                        value={activeNote.vibe}
                                        onChange={(event) =>
                                            updateActiveNote({ vibe: event.target.value })
                                        }
                                        placeholder="Vibe / Genre"
                                        className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
                                    />
                                </div>

                                <input
                                    value={activeNote.beatLink}
                                    onChange={(event) =>
                                        updateActiveNote({ beatLink: event.target.value })
                                    }
                                    placeholder="Beat link / reference link"
                                    className="mt-4 w-full rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
                                />
                            </div>

                            <div className="flex items-center gap-3 border-t border-zinc-800 bg-[#171A21] px-6 py-4 text-sm text-zinc-400">
                                <span className="rounded-lg bg-[#20242D] px-3 py-1">
                                    {activeNote.section || "Draft"}
                                </span>

                                {activeNote.bpm && (
                                    <span className="rounded-lg bg-[#20242D] px-3 py-1">
                                        {activeNote.bpm} BPM
                                    </span>
                                )}

                                {activeNote.musicalKey && (
                                    <span className="rounded-lg bg-[#20242D] px-3 py-1">
                                        {activeNote.musicalKey}
                                    </span>
                                )}

                                {activeNote.vibe && (
                                    <span className="rounded-lg bg-[#20242D] px-3 py-1">
                                        {activeNote.vibe}
                                    </span>
                                )}

                                <div className="ml-auto text-zinc-500">
                                    {activeNote
                                        ? `Saved locally • ${formatLastSaved(activeNote.updatedAt)}`
                                        : "Saved locally"}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center text-center text-zinc-500">
                            <p>Create a new note to begin.</p>
                            <button
                                onClick={createNote}
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