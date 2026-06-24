import { Gamepad2, Home, Sparkles } from "lucide-react";

export type AmourTab = "home" | "games" | "activities";

const items: { id: AmourTab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "games", label: "Games", Icon: Gamepad2 },
  { id: "activities", label: "Activities", Icon: Sparkles },
];

export function Nav({
  activeTab,
  onTabChange,
}: {
  activeTab: AmourTab;
  onTabChange: (tab: AmourTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-4 md:bottom-6 z-40 px-4 pointer-events-none" aria-label="Main navigation">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between rounded-full border border-black/10 bg-white/80 p-1.5 shadow-[0_22px_70px_-28px_rgba(0,0,0,0.38)] backdrop-blur-2xl backdrop-saturate-150 pointer-events-auto">
        {items.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={active ? "page" : undefined}
              className={`min-h-12 flex-1 rounded-full px-3 text-xs font-medium transition-all duration-300 grid place-items-center ${
                active
                  ? "bg-black text-white shadow-[0_12px_32px_-18px_rgba(0,0,0,0.8)]"
                  : "text-black/65 hover:bg-black/10 hover:text-black"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
