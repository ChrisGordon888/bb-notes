import { useEffect, useRef } from "react";
import type { Note } from "@/types/note";

type NoteEditorProps = {
  activeNote: Note | undefined;
  updateActiveNote: (updates: Partial<Note>) => void;
};

export default function NoteEditor({
  activeNote,
  updateActiveNote,
}: NoteEditorProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [activeNote?.id]);

  if (!activeNote) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(124,114,255,0.08),_transparent_32rem)]">
      <div className="mx-auto flex max-w-5xl flex-col px-8 py-10">
        <input
          ref={titleInputRef}
          type="text"
          value={activeNote.title}
          onChange={(event) => updateActiveNote({ title: event.target.value })}
          placeholder="Untitled Note"
          className="mb-6 w-full bg-transparent text-4xl font-semibold tracking-tight text-zinc-100 outline-none placeholder:text-zinc-700"
        />

        <div className="rounded-3xl border border-zinc-800 bg-[#11151C]/80 p-6 shadow-2xl shadow-black/20">
          <textarea
            value={activeNote.body}
            onChange={(event) => updateActiveNote({ body: event.target.value })}
            placeholder="Hooks, verses, concepts, voice memo transcriptions..."
            className="min-h-[52vh] w-full resize-none bg-transparent text-lg leading-8 text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={activeNote.section}
            onChange={(event) =>
              updateActiveNote({ section: event.target.value })
            }
            placeholder="Section"
            className="rounded-2xl border border-zinc-800 bg-[#11151C] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-[#7C72FF]/60"
          />

          <input
            value={activeNote.bpm}
            onChange={(event) => updateActiveNote({ bpm: event.target.value })}
            placeholder="BPM"
            className="rounded-2xl border border-zinc-800 bg-[#11151C] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-[#7C72FF]/60"
          />

          <input
            value={activeNote.musicalKey}
            onChange={(event) =>
              updateActiveNote({ musicalKey: event.target.value })
            }
            placeholder="Key"
            className="rounded-2xl border border-zinc-800 bg-[#11151C] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-[#7C72FF]/60"
          />

          <input
            value={activeNote.vibe}
            onChange={(event) => updateActiveNote({ vibe: event.target.value })}
            placeholder="Vibe / Genre"
            className="rounded-2xl border border-zinc-800 bg-[#11151C] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-[#7C72FF]/60"
          />
        </div>

        <input
          value={activeNote.beatLink}
          onChange={(event) =>
            updateActiveNote({ beatLink: event.target.value })
          }
          placeholder="Beat link / reference link"
          className="mt-3 rounded-2xl border border-zinc-800 bg-[#11151C] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-[#7C72FF]/60"
        />
      </div>
    </div>
  );
}