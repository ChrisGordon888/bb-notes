import type { Note } from "@/types/note";

export async function importNotes(
  file: File
): Promise<Note[] | null> {
  try {
    const text = await file.text();

    const parsedData = JSON.parse(text);

    if (!Array.isArray(parsedData)) {
      return null;
    }

    return parsedData as Note[];
  } catch {
    return null;
  }
}