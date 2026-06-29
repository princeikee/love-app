import { useRef } from "react";
import { getCardImage, type GameCategory } from "@/data/games";

const cardArt: Record<string, string> = {
  "green-red": "linear-gradient(135deg, rgba(35,136,92,0.8), rgba(92,24,44,0.82)), radial-gradient(circle at 24% 22%, rgba(255,255,255,0.22), transparent 28%)",
  "is-it-cheating": "linear-gradient(135deg, rgba(91,39,128,0.82), rgba(18,18,22,0.95)), radial-gradient(circle at 78% 18%, rgba(255,173,214,0.28), transparent 26%)",
  "most-likely": "linear-gradient(135deg, rgba(205,92,54,0.78), rgba(42,28,92,0.88)), radial-gradient(circle at 30% 18%, rgba(255,255,255,0.26), transparent 24%)",
  "agree-disagree": "linear-gradient(135deg, rgba(28,72,118,0.84), rgba(18,18,18,0.94)), radial-gradient(circle at 78% 28%, rgba(255,255,255,0.18), transparent 28%)",
  "this-or-that": "linear-gradient(135deg, rgba(32,93,113,0.86), rgba(101,45,82,0.82)), linear-gradient(90deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 100%)",
  "before-ring": "linear-gradient(135deg, rgba(184,143,72,0.86), rgba(24,25,33,0.94)), radial-gradient(circle at 70% 20%, rgba(255,248,208,0.34), transparent 24%)",
  "truth-or-dare": "linear-gradient(135deg, rgba(138,34,58,0.86), rgba(26,18,18,0.95)), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.18), transparent 22%)",
  "quick-fire": "linear-gradient(135deg, rgba(219,82,58,0.82), rgba(30,30,38,0.94)), repeating-linear-gradient(120deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 20px)",
  "testing-boundaries": "linear-gradient(135deg, rgba(107,76,38,0.82), rgba(20,24,34,0.95)), radial-gradient(circle at 22% 18%, rgba(255,255,255,0.2), transparent 28%)",
};

function getCardArt(cat: GameCategory, index: number) {
  return cardArt[cat.id] ?? [
    "linear-gradient(135deg, rgba(71,92,137,0.82), rgba(16,16,18,0.95))",
    `radial-gradient(circle at ${24 + (index % 4) * 16}% ${18 + (index % 3) * 10}%, rgba(255,255,255,0.22), transparent 26%)`,
    "linear-gradient(160deg, transparent 0 58%, rgba(255,255,255,0.08) 58% 100%)",
  ].join(", ");
}

export function CategoryCard({
  cat,
  onClick,
  index,
  isPlayed = false,
}: {
  cat: GameCategory;
  onClick: () => void;
  index: number;
  isPlayed?: boolean;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const imageSrc = cat.image ?? getCardImage(cat.id);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
      className="group relative snap-start shrink-0 w-[76vw] max-w-[320px] sm:w-[360px] md:w-[400px] lg:w-[430px] aspect-[4/5] rounded-[24px] md:rounded-3xl overflow-hidden hairline border bg-card text-left magnetic"
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <div className="absolute inset-0 scale-105 transition-transform duration-700 group-hover:scale-100" style={{ background: getCardArt(cat, index) }} />
      <img
        src={imageSrc}
        alt=""
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
          isPlayed ? "opacity-60 grayscale group-hover:opacity-75" : "opacity-80 saturate-125 group-hover:opacity-95"
        }`}
        onError={(event) => {
          const fallback = `https://picsum.photos/seed/amour-${cat.id}/900/1200`;
          if (event.currentTarget.src !== fallback) {
            event.currentTarget.src = fallback;
          } else {
            event.currentTarget.style.display = "none";
          }
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.78))]" />
      <div className="absolute left-6 top-16 h-20 w-20 rounded-full border border-white/20 bg-white/10 blur-[1px] md:left-8 md:top-20 md:h-28 md:w-28" />
      <div className="absolute right-6 top-24 h-16 w-28 rotate-[-18deg] rounded-full border border-white/15 bg-black/10 md:right-8 md:top-28 md:h-20 md:w-36" />
      <div className="absolute inset-0 grain" />
      <div
        className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(80% 60% at 20% 0%, rgba(255,255,255,0.14), transparent 60%), radial-gradient(70% 60% at 100% 100%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-white/74 md:top-5 md:left-5 md:right-5 md:tracking-[0.32em]">
        <span>No. {String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">{cat.spicy ? "After 10pm" : cat.mode}</span>
      </div>

      <div className="absolute inset-0 flex items-end p-5 md:p-8">
        <div>
          <h3 className="font-display text-[1.85rem] md:text-4xl leading-[1.02] tracking-tight">
            {cat.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-[28ch]">{cat.tagline}</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-foreground/80 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            Open
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.2em] text-white/65 md:bottom-5 md:right-5 md:tracking-[0.32em]">
        {cat.questions.length} prompts
      </div>
    </button>
  );
}

export function Carousel({
  title,
  subtitle,
  items,
  playedIds,
  onOpen,
}: {
  title: string;
  subtitle?: string;
  items: GameCategory[];
  playedIds?: Set<string>;
  onOpen: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <section className="relative py-9 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 flex items-end justify-between mb-5 md:mb-8">
        <div>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => scrollBy(-1)} aria-label="Previous" className="h-10 w-10 rounded-full hairline border grid place-items-center hover:bg-white/5 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Next" className="h-10 w-10 rounded-full hairline border grid place-items-center hover:bg-white/5 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar scroll-snap-x overflow-x-auto px-4 sm:px-6 md:px-10"
      >
        <div className="flex gap-3 sm:gap-5 md:gap-7 pb-4">
          {items.map((c, i) => (
            <CategoryCard key={c.id} cat={c} index={i} isPlayed={playedIds?.has(c.id)} onClick={() => onOpen(c.id)} />
          ))}
          <div className="shrink-0 w-2" />
        </div>
      </div>
    </section>
  );
}
