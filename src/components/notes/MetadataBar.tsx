import type { Note } from "@/types/note";

type MetadataBarProps = {
  activeNote: Note;
  formatLastSaved: (dateString: string) => string;
};

export default function MetadataBar({
  activeNote,
  formatLastSaved,
}: MetadataBarProps) {
  return (
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
        Saved locally • {formatLastSaved(activeNote.updatedAt)}
      </div>
    </div>
  );
}