type CollapsedSidebarProps = {
  onExpand: () => void;
};

export default function CollapsedSidebar({ onExpand }: CollapsedSidebarProps) {
  return (
    <aside className="flex w-14 flex-col items-center border-r border-zinc-800 bg-[#171A21] py-4">
      <button
        onClick={onExpand}
        title="Expand sidebar"
        className="rounded-2xl border border-zinc-800 bg-[#0F1115] px-3 py-2 text-xs font-semibold tracking-wide text-zinc-400 transition hover:border-[#7C72FF]/50 hover:text-zinc-100 hover:shadow-md hover:shadow-[#7C72FF]/10"
      >
        BB
      </button>

      <div className="mt-5 h-12 w-px bg-gradient-to-b from-[#7C72FF]/40 to-transparent" />
    </aside>
  );
}