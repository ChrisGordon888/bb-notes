import { useState } from "react";
import type { Note } from "@/types/note";
import type { TemplateType } from "@/data/templates";
import TemplatePicker from "./TemplatePicker";

type NotesSidebarProps = {
  notes: Note[];
  activeNoteId: string;
  search: string;
  setSearch: (value: string) => void;
  createNote: (templateType?: TemplateType) => void;
  deleteNote: (noteId: string) => void;
  setActiveNoteId: (noteId: string) => void;
  exportBackup: () => void;
  importBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollapse: () => void;
};

export default function NotesSidebar({
  notes,
  activeNoteId,
  search,
  setSearch,
  createNote,
  deleteNote,
  setActiveNoteId,
  exportBackup,
  importBackup,
  onCollapse,
}: NotesSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function getNotePreview(body: string) {
    const preview = body
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(" / ");

    return preview || "No lyrics yet...";
  }

  function formatUpdatedTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-zinc-800 bg-[#171A21] sm:w-80 lg:w-72">
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">BB Notes</h1>

            <p className="mt-1 text-sm text-zinc-400">
              Creative preservation workspace
            </p>
          </div>

          <button
            onClick={onCollapse}
            title="Collapse sidebar"
            className="hidden rounded-full border border-zinc-800 bg-[#0F1115] px-2 py-1 text-xs text-zinc-500 transition hover:border-[#7C72FF]/50 hover:text-zinc-200 hover:shadow-md hover:shadow-[#7C72FF]/10 sm:block"
          >
            ‹
          </button>
        </div>
      </div>

      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-xl border border-zinc-700 bg-[#0F1115] px-4 py-3 text-sm outline-none transition focus:border-zinc-500 sm:py-2"
        />
      </div>

      <div className="space-y-2 px-4 pb-4">
        <button
          onClick={() => setIsCreateOpen((current) => !current)}
          className="w-full rounded-xl bg-[#7C72FF] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#7C72FF]/10 transition hover:opacity-90 sm:py-2"
        >
          {isCreateOpen ? "Close Templates" : "+ New Note"}
        </button>

        {isCreateOpen && (
          <div className="max-h-72 overflow-y-auto rounded-xl border border-zinc-800 bg-[#0F1115] p-2 sm:max-h-80">
            <TemplatePicker createNote={createNote} />
          </div>
        )}

        <button
          onClick={exportBackup}
          className="w-full rounded-xl border border-zinc-700 bg-[#171A21] px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-[#1A1E26] sm:py-2"
        >
          Export Backup
        </button>

        <label className="block">
          <input
            type="file"
            accept=".json"
            onChange={importBackup}
            className="hidden"
          />

          <div className="cursor-pointer rounded-xl border border-zinc-700 bg-[#171A21] px-4 py-3 text-center text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-[#1A1E26] sm:py-2">
            Import Backup
          </div>
        </label>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {notes.length > 0 ? (
          notes.map((note) => {
            const isActive = note.id === activeNoteId;

            return (
              <div
                key={note.id}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-[#7C72FF]/50 bg-[#20242D] shadow-lg shadow-[#7C72FF]/10"
                    : "border-zinc-800 bg-[#141820] hover:border-zinc-700 hover:bg-[#1A1E26]"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 transition ${
                    isActive ? "bg-[#7C72FF]" : "bg-transparent"
                  }`}
                />

                <button
                  onClick={() => setActiveNoteId(note.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate font-medium text-zinc-100">
                      {note.title || "Untitled Note"}
                    </p>

                    <span className="shrink-0 text-[11px] text-zinc-600">
                      {formatUpdatedTime(note.updatedAt)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                    {getNotePreview(note.body)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#0F1115] px-2 py-1 text-[11px] text-zinc-400">
                      {note.section || "Draft"}
                    </span>

                    {note.bpm && (
                      <span className="rounded-full bg-[#0F1115] px-2 py-1 text-[11px] text-zinc-400">
                        {note.bpm} BPM
                      </span>
                    )}

                    {note.musicalKey && (
                      <span className="rounded-full bg-[#0F1115] px-2 py-1 text-[11px] text-zinc-400">
                        {note.musicalKey}
                      </span>
                    )}

                    {note.vibe && (
                      <span className="rounded-full bg-[#0F1115] px-2 py-1 text-[11px] text-zinc-400">
                        {note.vibe}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="mt-3 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-500 transition hover:border-red-500 hover:text-red-400 sm:hidden sm:group-hover:block"
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-sm text-zinc-500">
            No notes found yet. Create a blank note or choose a song template.
          </div>
        )}
      </div>
    </aside>
  );
}