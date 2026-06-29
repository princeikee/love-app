import { getCardImage, type GameCategory } from "@/data/games";

export function ChallengeStrip({
  daily,
  weekly,
  onOpen,
}: {
  daily: GameCategory;
  weekly: GameCategory;
  onOpen: (id: string) => void;
}) {
  return (
    <section className="py-12 md:py-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-2 gap-5 md:gap-7">
        <ChallengeCard
          kind="Daily"
          tag="Today"
          cat={daily}
          onOpen={() => onOpen(daily.id)}
          accent="Two roads, one evening."
        />
        <ChallengeCard
          kind="Weekly"
          tag="This week"
          cat={weekly}
          onOpen={() => onOpen(weekly.id)}
          accent="A long-form alignment ritual."
        />
      </div>
    </section>
  );
}

function ChallengeCard({
  kind,
  tag,
  cat,
  onOpen,
  accent,
}: {
  kind: string;
  tag: string;
  cat: GameCategory;
  onOpen: () => void;
  accent: string;
}) {
  const imageSrc = cat.image ?? getCardImage(cat.id);

  return (
    <button
      onClick={onOpen}
      className="group text-left relative overflow-hidden rounded-[24px] md:rounded-3xl hairline border bg-card p-5 sm:p-8 md:p-10 magnetic min-h-[300px] md:min-h-[340px] flex flex-col justify-between"
    >
      <img
        src={imageSrc}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 saturate-125 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
        onError={(event) => {
          const fallback = `https://picsum.photos/seed/amour-${cat.id}/900/700`;
          if (event.currentTarget.src !== fallback) {
            event.currentTarget.src = fallback;
          } else {
            event.currentTarget.style.display = "none";
          }
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.74))]" />
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(80% 60% at 90% 10%, rgba(255,255,255,0.08), transparent 60%)" }}
      />
      <div className="absolute inset-0 grain" />
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] md:tracking-[0.32em] text-white/72 relative">
        <span>{kind} challenge</span>
        <span className="rounded-full bg-black/35 px-2 py-1 backdrop-blur-md">{tag}</span>
      </div>
      <div className="relative">
        <h3 className="font-display text-3xl sm:text-4xl md:text-6xl leading-[0.98] tracking-tight">{cat.title}</h3>
        <p className="mt-3 text-muted-foreground max-w-md">{accent}</p>
      </div>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80 breathe" />
          {cat.questions.length} prompts - 8 min
        </div>
        <span className="inline-flex items-center gap-2 text-sm">
          Begin
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  );
}
