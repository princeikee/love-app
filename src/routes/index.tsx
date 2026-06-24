import { createFileRoute } from "@tanstack/react-router";
import { Heart, Lock, LogOut, Moon, RefreshCw, Sun } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Carousel } from "@/components/amour/Carousel";
import { ChallengeStrip } from "@/components/amour/Sections";
import { GamePlayer } from "@/components/amour/GamePlayer";
import { Hero } from "@/components/amour/Hero";
import { type AmourTab, Nav } from "@/components/amour/Nav";
import { CATEGORIES, COLLECTIONS, DAILY_ID, FEATURED_ID, RECENT_IDS, WEEKLY_ID, getCardImage, getCategory, type GameCategory } from "@/data/games";
import { loadAmourSnapshot, markCategorySeen } from "@/lib/amourClient";
import { partnerOf, PROFILES, type AmourActivity, type AmourSnapshot, type ProfileId, type SavedRound } from "@/lib/amourTypes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amour - Mr Babe & Nom Nom Princess" },
      { name: "description", content: "A private question room for Mr Babe and Nom Nom Princess." },
      { property: "og:title", content: "Amour - Mr Babe & Nom Nom Princess" },
      { property: "og:description", content: "A private question room for two." },
    ],
  }),
  component: AmourHome,
});

type GameFilter = "updated" | "partner" | "played" | "all";
type ThemeMode = "light" | "dark";

const profileStorageKey = "amour:active-profile";
const themeStorageKey = "amour:theme";

function readStoredProfile(): ProfileId | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(profileStorageKey);
  return value === "mr-babe" || value === "nom-nom-princess" ? value : null;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function AmourHome() {
  const [profileId, setProfileId] = useState<ProfileId | null>(() => readStoredProfile());
  const [snapshot, setSnapshot] = useState<AmourSnapshot | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AmourTab>("home");
  const [gameFilter, setGameFilter] = useState<GameFilter>("partner");
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readStoredTheme());

  const featured = getCategory(FEATURED_ID)!;
  const daily = getCategory(DAILY_ID)!;
  const weekly = getCategory(WEEKLY_ID)!;
  const recents = RECENT_IDS.map(getCategory).filter(Boolean) as GameCategory[];

  const refreshSnapshot = useCallback(async (nextProfileId = profileId) => {
    if (!nextProfileId) return;
    const next = await loadAmourSnapshot(nextProfileId);
    setSnapshot(next);
  }, [profileId]);

  useEffect(() => {
    void refreshSnapshot();
  }, [refreshSnapshot]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem(themeStorageKey, themeMode);
  }, [themeMode]);

  const open = useCallback((id: string) => {
    setActiveId(id);
    if (profileId) {
      const cat = getCategory(id);
      if (cat) {
        setSnapshot((current) => current
          ? {
              ...current,
              seenQuestionCounts: {
                ...current.seenQuestionCounts,
                [id]: cat.questions.length,
              },
            }
          : current);
        void markCategorySeen({ profileId, categoryId: id, questionCount: cat.questions.length });
      }
    }
  }, [profileId]);

  const close = useCallback(() => {
    setActiveId(null);
    void refreshSnapshot();
  }, [refreshSnapshot]);

  const switchTab = useCallback((tab: AmourTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeId || !profileId) return;
      if (e.key === "Enter") setActiveId(FEATURED_ID);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, profileId]);

  const active = activeId ? getCategory(activeId) : null;
  const partnerRecent = useMemo(() => {
    if (!snapshot || !profileId) return undefined;
    const partnerId = partnerOf(profileId);
    const activity = snapshot.activities.find((item) => item.actor === partnerId && item.action === "completed" && getCategory(item.categoryId));
    if (!activity) return undefined;
    return { ...activity, category: getCategory(activity.categoryId) } as AmourActivity & { category?: GameCategory };
  }, [profileId, snapshot]);

  const categorizedGames = useMemo(() => {
    if (!snapshot || !profileId) return { updated: [], partner: [], played: [], all: CATEGORIES };
    const partnerId = partnerOf(profileId);

    return {
      updated: CATEGORIES.filter((cat) => {
        const seenCount = snapshot.seenQuestionCounts[cat.id];
        return typeof seenCount === "number" && seenCount < cat.questions.length;
      }),
      partner: CATEGORIES.filter((cat) => {
        const round = snapshot.rounds[cat.id];
        return round?.[partnerId]?.length === cat.questions.length && round?.[profileId]?.length !== cat.questions.length;
      }),
      played: CATEGORIES.filter((cat) => snapshot.rounds[cat.id]?.[profileId]?.length === cat.questions.length),
      all: CATEGORIES,
    };
  }, [profileId, snapshot]);

  const handleLogin = (nextProfileId: ProfileId) => {
    window.localStorage.setItem(profileStorageKey, nextProfileId);
    setProfileId(nextProfileId);
    void refreshSnapshot(nextProfileId);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(profileStorageKey);
    setProfileId(null);
    setSnapshot(null);
    setActiveId(null);
    setActiveTab("home");
  };

  const handleRoundSaved = (categoryId: string, round: SavedRound) => {
    setSnapshot((current) => current
      ? {
          ...current,
          rounds: { ...current.rounds, [categoryId]: round },
        }
      : current);
  };

  if (!profileId) {
    return <ProfileGate onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen pb-28 md:pb-32">
      <header className="sticky top-0 z-30 px-4 py-3 sm:px-6 md:px-10 pointer-events-none">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <div className="top-pill pointer-events-auto">
            <Heart size={14} fill="currentColor" strokeWidth={1.7} />
            <span>Signed in as <span className="font-medium text-foreground">{PROFILES[profileId].name}</span></span>
            {snapshot && <span className="ml-1 opacity-50">({snapshot.source})</span>}
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setThemeMode((current) => current === "dark" ? "light" : "dark")}
              className="top-icon"
              aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}
            >
              {themeMode === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
            </button>
            <button onClick={handleLogout} className="top-icon" aria-label="Switch profile">
              <LogOut size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {activeTab === "home" && (
        <Hero
          featured={featured}
          profileId={profileId}
          partnerRecent={partnerRecent}
          onPlay={open}
          onContinue={() => open(FEATURED_ID)}
          onBrowse={() => switchTab("games")}
        />
      )}

      {activeTab === "games" && (
        <main className="pt-6 md:pt-10">
          <section className="px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto pb-4 md:pb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-4">Games / Questions</div>
                <h1 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-tight max-w-3xl text-balance">
                  Choose the conversation.
                </h1>
              </div>
              <button onClick={() => void refreshSnapshot()} className="btn-ghost magnetic min-h-11 self-start md:self-auto">
                <RefreshCw size={15} strokeWidth={1.8} />
                Sync
              </button>
            </div>

            <div className="segmented mt-6 grid grid-cols-2 gap-1.5 p-1.5 sm:mt-8 sm:flex sm:w-fit">
              {([
                ["partner", `Partner played`, categorizedGames.partner.length],
                ["updated", `Updated`, categorizedGames.updated.length],
                ["played", `Played`, categorizedGames.played.length],
                ["all", `All`, categorizedGames.all.length],
              ] as const).map(([id, label, count]) => (
                <button
                  key={id}
                  onClick={() => setGameFilter(id)}
                  className={`segmented-item min-h-11 px-3 text-[13px] transition sm:px-4 sm:text-sm ${gameFilter === id ? "is-active" : ""}`}
                >
                  {label} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </section>

          {gameFilter === "all" ? COLLECTIONS.map((col) => (
            <Carousel
              key={col.id}
              title={col.title}
              subtitle={col.subtitle}
              items={col.ids.map(getCategory).filter(Boolean) as GameCategory[]}
              onOpen={open}
            />
          )) : (
            <GameGrid
              games={categorizedGames[gameFilter]}
              rounds={snapshot?.rounds ?? {}}
              seen={snapshot?.seenQuestionCounts ?? {}}
              profileId={profileId}
              emptyLabel={
                gameFilter === "partner"
                  ? `${PROFILES[partnerOf(profileId)].shortName} has not finished a waiting card yet.`
                  : gameFilter === "updated"
                    ? "No updated cards right now."
                    : "Nothing here yet."
              }
              onOpen={open}
            />
          )}
        </main>
      )}

      {activeTab === "activities" && (
        <main className="pt-6 md:pt-10">
          <section className="px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto pb-4 md:pb-8">
            <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-4">Activities</div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-tight max-w-3xl text-balance">
              Tiny rituals for tonight.
            </h1>
          </section>

          <ChallengeStrip daily={daily} weekly={weekly} onOpen={open} />

          <section className="py-12 md:py-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto">
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-3">Recently played</div>
              <h2 className="font-display text-3xl md:text-5xl tracking-tight">Pick up where you left off</h2>
            </div>
            <ul className="divide-y hairline border-y">
              {(snapshot?.activities.length ? snapshot.activities : recents.map((c) => ({
                id: c.id,
                actor: profileId,
                categoryId: c.id,
                action: "seen",
                summary: c.tagline,
                createdAt: new Date().toISOString(),
              } as AmourActivity))).map((activity, i) => {
                const c = getCategory(activity.categoryId);
                if (!c) return null;
                return (
                  <li key={`${activity.id}-${c.id}`}>
                    <button onClick={() => open(c.id)} className="group w-full grid grid-cols-12 items-center gap-3 py-5 md:py-7 px-2 md:px-4 hover:bg-white/[0.02] transition-colors text-left">
                      <span className="col-span-1 text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      <span className="col-span-8 md:col-span-6 font-display text-xl md:text-3xl leading-tight">{c.title}</span>
                      <span className="hidden md:block col-span-3 text-sm text-muted-foreground truncate">{PROFILES[activity.actor].shortName} {activity.summary}</span>
                      <span className="col-span-3 md:col-span-2 justify-self-end inline-flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition">
                        Open
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      )}

      <Nav activeTab={activeTab} onTabChange={switchTab} />

      {active && snapshot && (
        <GamePlayer
          cat={active}
          profileId={profileId}
          round={snapshot.rounds[active.id] ?? {}}
          onClose={close}
          onRoundSaved={handleRoundSaved}
        />
      )}
    </div>
  );
}

function ProfileGate({ onLogin }: { onLogin: (profileId: ProfileId) => void }) {
  const [selected, setSelected] = useState<ProfileId | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const submit = (profileId = selected) => {
    if (!profileId) return;
    if (passcode === PROFILES[profileId].passcode) {
      onLogin(profileId);
      return;
    }
    setError("That passcode is not right for this profile.");
  };

  return (
    <main className="min-h-dvh px-4 py-8 sm:px-6 grid place-items-center">
      <section className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 h-12 w-12 rounded-full border border-white/10 bg-white/[0.05] grid place-items-center">
            <Lock size={18} strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-[2.8rem] sm:text-5xl md:text-7xl leading-none tracking-tight">Who is using this?</h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Choose your profile, then put in your passcode.</p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
            const profile = PROFILES[id];
            const active = selected === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelected(id);
                  setPasscode("");
                  setError("");
                }}
                className={`min-h-[200px] rounded-[24px] hairline border bg-card p-5 text-left relative overflow-hidden transition sm:min-h-[260px] sm:rounded-[28px] ${
                  active ? "ring-2 ring-white/70" : "hover:bg-white/[0.045]"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(75%_70%_at_30%_0%,rgba(255,255,255,0.08),transparent_65%)]" />
                <div className="relative h-full flex flex-col justify-between">
                  <div className="h-16 w-16 rounded-full bg-white text-black grid place-items-center text-sm font-semibold sm:h-20 sm:w-20 sm:text-base">
                    {profile.initials}
                  </div>
                  <div>
                    <div className="font-display text-3xl sm:text-4xl md:text-5xl">{profile.name}</div>
                    <p className="mt-3 text-sm text-muted-foreground leading-6">{profile.note}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="mx-auto mt-6 max-w-md rounded-[24px] hairline border bg-card p-4 sm:p-5"
          >
            <label htmlFor="passcode" className="text-sm text-white/82">
              Put in your passcode for {PROFILES[selected].name}
            </label>
            <div className="mt-3 flex flex-col gap-3 min-[420px]:flex-row">
              <input
                id="passcode"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value.replace(/\D/g, "").slice(0, 4));
                  setError("");
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-black/25 px-5 text-center text-lg tracking-[0.4em] outline-none focus:border-white/35"
                aria-invalid={Boolean(error)}
              />
              <button disabled={passcode.length !== 4} className="btn-primary min-h-12 disabled:opacity-40 disabled:cursor-not-allowed">
                Enter
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}

function GameGrid({
  games,
  rounds,
  seen,
  profileId,
  emptyLabel,
  onOpen,
}: {
  games: GameCategory[];
  rounds: Record<string, SavedRound>;
  seen: Record<string, number>;
  profileId: ProfileId;
  emptyLabel: string;
  onOpen: (id: string) => void;
}) {
  if (games.length === 0) {
    return (
      <section className="px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto py-10">
        <div className="rounded-[24px] hairline border bg-card p-8 text-muted-foreground">{emptyLabel}</div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-12 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
        {games.map((c, i) => (
          <GameCard
            key={c.id}
            cat={c}
            index={i}
            round={rounds[c.id]}
            seenCount={seen[c.id]}
            profileId={profileId}
            onOpen={() => onOpen(c.id)}
          />
        ))}
      </div>
    </section>
  );
}

function GameCard({
  cat,
  index,
  round,
  seenCount,
  profileId,
  onOpen,
}: {
  cat: GameCategory;
  index: number;
  round?: SavedRound;
  seenCount?: number;
  profileId: ProfileId;
  onOpen: () => void;
}) {
  const partnerId = partnerOf(profileId);
  const mineDone = round?.[profileId]?.length === cat.questions.length;
  const partnerDone = round?.[partnerId]?.length === cat.questions.length;
  const updated = typeof seenCount === "number" && seenCount < cat.questions.length;
  const status = mineDone && partnerDone ? "Completed" : partnerDone ? "Partner done" : mineDone ? "Played" : updated ? "Updated" : cat.mode;
  const imageSrc = cat.image ?? getCardImage(cat.id);

  return (
    <button
      onClick={onOpen}
      className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-[18px] sm:rounded-[22px] hairline border bg-card p-3 sm:p-5 text-left magnetic overflow-hidden min-h-[210px] sm:min-h-0"
    >
      <img
        src={imageSrc}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-luminosity transition duration-700 group-hover:scale-105 group-hover:opacity-90"
        onError={(event) => {
          const fallback = `https://picsum.photos/seed/amour-${cat.id}/700/900`;
          if (event.currentTarget.src !== fallback) {
            event.currentTarget.src = fallback;
          } else {
            event.currentTarget.style.display = "none";
          }
        }}
      />
      <div
        className="absolute inset-0 opacity-85 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.78)), radial-gradient(60% 50% at 30% 0%, rgba(255,255,255,0.14), transparent 60%)" }}
      />
      <div className="relative flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.14em] text-white/72 sm:text-[10px] sm:tracking-[0.22em]">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full border border-white/12 bg-black/35 px-2 py-1 tracking-[0.1em] backdrop-blur-md sm:tracking-[0.16em]">{status}</span>
      </div>
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
        <div className="font-display text-[1.45rem] leading-[1.02] sm:text-2xl md:text-3xl">{cat.title}</div>
        <div className="mt-2 text-[11px] text-white/62 sm:text-[12px]">{cat.questions.length} prompts</div>
      </div>
    </button>
  );
}
