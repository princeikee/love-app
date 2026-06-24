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
      <div className="amour-nav mx-auto flex w-full max-w-[420px] items-center justify-between p-1.5 pointer-events-auto">
        {items.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={active ? "page" : undefined}
              className={`amour-nav-item min-h-12 flex-1 px-3 text-xs font-medium transition-all duration-300 grid place-items-center ${active ? "is-active" : ""}`}
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
