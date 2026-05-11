import { templates, type TemplateType } from "@/data/templates";

type TemplatePickerProps = {
  createNote: (templateType?: TemplateType) => void;
};

const templateInfo = [
  {
    id: "blank",
    title: "Blank Note",
    description: "Start from scratch.",
  },
  {
    id: "freestyle",
    title: "Freestyle",
    description: "Capture ideas, punch-ins, and freewriting.",
  },
  {
    id: "songStructureV1",
    title: "Song V1",
    description: "Classic hook-driven arrangement.",
  },
  {
    id: "songStructureV2",
    title: "Song V2",
    description: "Modern pre-hook structure.",
  },
  {
    id: "songStructureV3",
    title: "Song V3",
    description: "Intro + hook-first flow.",
  },
] as const;

export default function TemplatePicker({
  createNote,
}: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      {templateInfo.map((template) => (
        <div
          key={template.id}
          className="rounded-xl border border-zinc-800 bg-[#0F1115] p-4"
        >
          <div className="mb-3">
            <h3 className="font-medium text-zinc-100">
              {template.title}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              {template.description}
            </p>
          </div>

          <pre className="overflow-hidden whitespace-pre-wrap rounded-lg bg-[#171A21] p-3 text-xs text-zinc-400">
            {templates[template.id]}
          </pre>

          <button
            onClick={() => createNote(template.id)}
            className="mt-3 w-full rounded-lg bg-[#7C72FF] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Use Template
          </button>
        </div>
      ))}
    </div>
  );
}