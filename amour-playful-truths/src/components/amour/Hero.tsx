import { useState } from "react";
import { Heart, Image as ImageIcon, MessageCircleHeart, Play } from "lucide-react";
import type { GameCategory } from "@/data/games";
import { partnerOf, PROFILES, type AmourActivity, type ProfileId } from "@/lib/amourTypes";

export function Hero({
  featured,
  profileId,
  partnerRecent,
  onPlay,
  onContinue,
  onBrowse,
}: {
  featured: GameCategory;
  profileId: ProfileId;
  partnerRecent?: AmourActivity & { category?: GameCategory };
  onPlay: (id: string) => void;
  onContinue: () => void;
  onBrowse?: () => void;
}) {
  const profile = PROFILES[profileId];
  const partner = PROFILES[partnerOf(profileId)];
  const recentCategory = partnerRecent?.category ?? featured;

  return (
    <section id="top" className="relative px-4 pt-8 pb-12 sm:px-6 md:px-10 md:pt-12 md:pb-20 max-w-[1400px] mx-auto">
      <div className="grid lg:grid-cols-12 gap-5 md:gap-7 items-stretch">
        <div className="lg:col-span-7 rounded-[24px] md:rounded-[34px] hairline border bg-card overflow-hidden relative min-h-[540px] sm:min-h-[600px] md:min-h-[680px]">
          <div className="absolute inset-0 grain" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,255,255,0.09),transparent_68%)]" />

          <div className="relative grid grid-cols-2 gap-2 p-3 sm:p-4 h-[250px] sm:h-[320px] md:h-[380px]">
            <PhotoTile profileId="mr-babe" className="rounded-[20px] md:rounded-[28px]" />
            <PhotoTile profileId="nom-nom-princess" className="rounded-[20px] md:rounded-[28px] translate-y-5 sm:translate-y-8" />
          </div>

          <div className="relative px-4 pb-5 pt-9 sm:px-8 sm:pt-12 md:px-10 md:pb-10">
            <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/70 sm:mb-5 sm:text-xs">
              <Heart size={14} strokeWidth={1.8} />
              <span className="truncate">Only for {PROFILES["mr-babe"].shortName} and {PROFILES["nom-nom-princess"].shortName}</span>
            </div>
            <h1 className="font-display text-[2.8rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.94] tracking-tight text-balance">
              Hi {profile.shortName}. This room kept your place.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] md:text-lg leading-7 text-muted-foreground text-pretty sm:mt-6">
              A tiny private corner for answers, soft trouble, late-night questions, and all the little things you two keep choosing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={onContinue} className="btn-primary magnetic min-h-12">
                <Play size={16} fill="currentColor" strokeWidth={1.8} />
                Continue {featured.title}
              </button>
              <button onClick={onBrowse} className="btn-ghost magnetic min-h-12">Browse games</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid gap-5 md:gap-7">
          <section className="rounded-[24px] md:rounded-[28px] hairline border bg-card p-5 sm:p-7 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 grain" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white text-black grid place-items-center text-sm font-semibold">
                  {partner.initials}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Your partner</div>
                  <div className="font-display text-2xl">{partner.name}</div>
                </div>
              </div>
              <p className="mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-white/86 text-pretty">{partner.note}</p>
            </div>
          </section>

          <section className="rounded-[24px] md:rounded-[28px] hairline border bg-card p-5 sm:p-7 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_100%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                <MessageCircleHeart size={15} strokeWidth={1.8} />
                Partner recently played
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight mt-5 text-balance">{recentCategory.title}</h2>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-7">
                {partnerRecent
                  ? `${partner.shortName} finished this. Respond or play now to see their answers.`
                  : `When ${partner.shortName} plays, their latest card will land here.`}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button onClick={() => onPlay(recentCategory.id)} className="btn-primary magnetic min-h-12">
                  Respond now
                </button>
                <button onClick={onBrowse} className="btn-ghost magnetic min-h-12">
                  See all cards
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] md:rounded-[28px] hairline border bg-card p-5 sm:p-7 md:p-8">
            <div className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Tonight's soft dare</div>
            <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight mt-4 text-balance">
              Say the thing you normally save for later.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

function PhotoTile({ profileId, className = "" }: { profileId: ProfileId; className?: string }) {
  const profile = PROFILES[profileId];
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-white/[0.045] hairline border ${className}`}>
      <img
        src={profile.image}
        alt={profile.name}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className={`absolute inset-0 grid place-items-center p-4 text-center transition-opacity duration-300 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div>
          <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-white/15 bg-black/30 grid place-items-center sm:h-12 sm:w-12">
            <ImageIcon size={20} strokeWidth={1.7} />
          </div>
          <div className="font-display text-xl sm:text-2xl">{profile.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">Add photo later</div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 to-transparent">
        <div className="text-xs uppercase tracking-[0.24em] text-white/72">{profile.initials}</div>
      </div>
    </div>
  );
}
