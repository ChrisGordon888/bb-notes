import type { Note } from "@/types/note";

type NoteEditorProps = {
  activeNote: Note | undefined;
  updateActiveNote: (updates: Partial<Note>) => void;
};

export default function NoteEditor({
  activeNote,
  updateActiveNote,
}: NoteEditorProps) {
  if (!activeNote) return null;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <input
        type="text"
        value={activeNote.title}
        onChange={(event) => updateActiveNote({ title: event.target.value })}
        placeholder="Untitled Note"
        className="mb-6 w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-zinc-600"
      />

      <textarea
        value={activeNote.body}
        onChange={(event) => updateActiveNote({ body: event.target.value })}
        placeholder="Hooks, verses, concepts, voice memo transcriptions..."
        className="h-[55vh] w-full resize-none bg-transparent text-lg leading-8 text-zinc-200 outline-none placeholder:text-zinc-600"
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <input
          value={activeNote.section}
          onChange={(event) => updateActiveNote({ section: event.target.value })}
          placeholder="Section"
          className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
        />

        <input
          value={activeNote.bpm}
          onChange={(event) => updateActiveNote({ bpm: event.target.value })}
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
          onChange={(event) => updateActiveNote({ vibe: event.target.value })}
          placeholder="Vibe / Genre"
          className="rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
        />
      </div>

      <input
        value={activeNote.beatLink}
        onChange={(event) => updateActiveNote({ beatLink: event.target.value })}
        placeholder="Beat link / reference link"
        className="mt-4 w-full rounded-xl border border-zinc-800 bg-[#171A21] px-4 py-3 text-sm outline-none focus:border-zinc-600"
      />
    </div>
  );
}