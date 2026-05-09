import type { Note } from "@/types/note";

type NotesSidebarProps = {
  notes: Note[];
  activeNoteId: string;
  search: string;
  setSearch: (value: string) => void;
  createNote: () => void;
  deleteNote: (noteId: string) => void;
  setActiveNoteId: (noteId: string) => void;
  exportBackup: () => void;
  importBackup: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
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
}: NotesSidebarProps) {
  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-[#171A21]">
      <div className="border-b border-zinc-800 p-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          BB Notes
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Creative preservation workspace
        </p>
      </div>

      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-xl border border-zinc-700 bg-[#0F1115] px-4 py-2 text-sm outline-none transition focus:border-zinc-500"
        />
      </div>

      <div className="space-y-2 px-4 pb-4">
        <button
          onClick={createNote}
          className="w-full rounded-xl bg-[#7C72FF] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          + New Note
        </button>

        <button
          onClick={exportBackup}
          className="w-full rounded-xl border border-zinc-700 bg-[#171A21] px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500"
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

          <div className="cursor-pointer rounded-xl border border-zinc-700 bg-[#171A21] px-4 py-2 text-center text-sm text-zinc-300 transition hover:border-zinc-500">
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
                className={`group w-full rounded-xl border p-3 text-left transition ${
                  isActive
                    ? "border-zinc-700 bg-[#20242D]"
                    : "border-transparent hover:border-zinc-700 hover:bg-[#1A1E26]"
                }`}
              >
                <button
                  onClick={() => setActiveNoteId(note.id)}
                  className="w-full text-left"
                >
                  <p className="truncate font-medium">
                    {note.title || "Untitled Note"}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {note.section || "Draft"}
                    {note.bpm ? ` • ${note.bpm} BPM` : ""}
                    {note.vibe ? ` • ${note.vibe}` : ""}
                  </p>
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="mt-3 hidden rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-500 transition hover:border-red-500 hover:text-red-400 group-hover:block"
                >
                  Delete
                </button>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-sm text-zinc-500">
            No notes found.
          </div>
        )}
      </div>
    </aside>
  );
}