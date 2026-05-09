import type { Note } from "@/types/note";

export function exportNotes(notes: Note[]) {
  const fileData = JSON.stringify(notes, null, 2);

  const blob = new Blob([fileData], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  const timestamp = new Date()
    .toISOString()
    .split("T")[0];

  link.href = url;
  link.download = `bb-notes-backup-${timestamp}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}