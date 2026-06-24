import { useEffect, useMemo, useState } from "react";
import type { GameCategory } from "@/data/games";
import { markCategorySeen, saveProfileAnswers } from "@/lib/amourClient";
import { partnerOf, PROFILES, type Answer, type ProfileId, type SavedRound } from "@/lib/amourTypes";

type Phase = "intro" | "answer" | "waiting" | "reveal" | "done";

export function GamePlayer({
  cat,
  profileId,
  round: initialRound,
  onClose,
  onRoundSaved,
}: {
  cat: GameCategory;
  profileId: ProfileId;
  round: SavedRound;
  onClose: () => void;
  onRoundSaved: (categoryId: string, round: SavedRound) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [draft, setDraft] = useState<Answer[]>([]);
  const [round, setRound] = useState<SavedRound>(initialRound);

  const question = cat.questions[qIndex];
  const total = cat.questions.length;
  const partnerId = partnerOf(profileId);
  const profile = PROFILES[profileId];

  const options = useMemo<string[] | undefined>(() => {
    if (cat.mode === "binary") return cat.choices;
    if (cat.mode === "pick" || cat.mode === "rank") return cat.questionOptions?.[qIndex] ?? cat.options;
    return undefined;
  }, [cat, qIndex]);

  const isComplete = (id: ProfileId) => (round[id]?.length ?? 0) >= total;
  const bothFinished = Boolean(isComplete(profileId) && isComplete(partnerId));
  const progress = Math.min(1, qIndex / Math.max(1, total - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setRound(initialRound);
  }, [initialRound, cat.id]);

  useEffect(() => {
    void markCategorySeen({ profileId, categoryId: cat.id, questionCount: cat.questions.length });
  }, [cat.id, cat.questions.length, profileId]);

  const start = () => {
    const existingAnswers = round[profileId] ?? [];
    setDraft(existingAnswers.slice(0, total));
    setQIndex(Math.min(existingAnswers.length, total - 1));
    setPhase("answer");
  };

  const submit = async (value: Answer) => {
    const nextDraft = [...draft, value];
    if (qIndex < total - 1) {
      setDraft(nextDraft);
      setQIndex(i => i + 1);
      return;
    }

    const nextRound = await saveProfileAnswers({
      profileId,
      categoryId: cat.id,
      categoryTitle: cat.title,
      answers: nextDraft,
      questionCount: total,
    });
    setDraft(nextDraft);
    setRound(nextRound);
    onRoundSaved(cat.id, nextRound);
    setPhase((nextRound[profileId]?.length ?? 0) >= total && (nextRound[partnerId]?.length ?? 0) >= total ? "reveal" : "waiting");
  };

  const clearRound = () => {
    setRound({});
    setDraft([]);
    setQIndex(0);
    setPhase("intro");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background fade-in">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={onClose} aria-label="Close" className="h-10 w-10 rounded-full hairline border grid place-items-center hover:bg-white/5 transition shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{cat.mode}{cat.spicy ? " - after 10pm" : ""}</div>
              <div className="font-display text-lg md:text-xl truncate">{cat.title}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
            {phase === "answer" && <span className="tabular-nums">{String(qIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>}
            <div className="h-px w-32 bg-white/10 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white transition-all duration-700" style={{ width: `${phase === "answer" ? progress * 100 : bothFinished ? 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto">
        <div className="min-h-full max-w-[1100px] mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 flex flex-col">
          {phase === "intro" && (
            <IntroPhase
              cat={cat}
              profileId={profileId}
              round={round}
              onStart={start}
              onReveal={() => setPhase("reveal")}
              onClear={clearRound}
            />
          )}

          {phase === "answer" && (
            <AnswerPhase
              key={`${qIndex}-${profileId}`}
              cat={cat}
              question={question}
              options={options}
              player={profile.name}
              index={qIndex}
              total={total}
              onSubmit={submit}
            />
          )}

          {phase === "waiting" && (
            <WaitingPhase
              cat={cat}
              round={round}
              profileId={profileId}
              onReveal={() => setPhase("reveal")}
              onClose={onClose}
            />
          )}

          {phase === "reveal" && round[profileId] && round[partnerId] && (
            <RevealPhase cat={cat} round={round} profileId={profileId} onDone={() => setPhase("done")} />
          )}

          {phase === "done" && (
            <DonePhase cat={cat} round={round} profileId={profileId} onReplay={clearRound} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function IntroPhase({
  cat,
  profileId,
  round,
  onStart,
  onReveal,
  onClear,
}: {
  cat: GameCategory;
  profileId: ProfileId;
  round: SavedRound;
  onStart: () => void;
  onReveal: () => void;
  onClear: () => void;
}) {
  const partnerId = partnerOf(profileId);
  const answeredCount = round[profileId]?.length ?? 0;
  const partnerAnsweredCount = round[partnerId]?.length ?? 0;
  const meDone = answeredCount >= cat.questions.length;
  const partnerDone = partnerAnsweredCount >= cat.questions.length;
  const hasStarted = answeredCount > 0 && !meDone;
  const remainingCount = Math.max(0, cat.questions.length - answeredCount);

  return (
    <div className="my-auto fade-up">
      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-6">{cat.questions.length} prompts - async for two</div>
      <h2 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-tight max-w-3xl text-balance">{cat.title}</h2>
      <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground text-pretty">
        Answer your side privately. Your partner can answer later from wherever they are. The reveal stays locked until both sides are finished.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {!meDone && (
          <button onClick={onStart} className="btn-primary magnetic">
            {hasStarted ? `Answer ${remainingCount} new prompt${remainingCount === 1 ? "" : "s"}` : "Play my side"}
          </button>
        )}
        {meDone && partnerDone && <button onClick={onReveal} className="btn-primary magnetic">Reveal answers</button>}
        {(meDone || partnerDone) && <button onClick={onClear} className="btn-ghost magnetic">Start fresh</button>}
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [PROFILES[profileId].shortName, meDone ? "Complete" : `${answeredCount}/${cat.questions.length}`],
          [PROFILES[partnerId].shortName, partnerDone ? "Complete" : `${partnerAnsweredCount}/${cat.questions.length}`],
          ["Reveal", meDone && partnerDone ? "Unlocked" : "Locked"],
          ["Mode", "Long-distance"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl hairline border bg-card p-4">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{label}</div>
            <div className="font-display text-2xl mt-2">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswerPhase({
  cat,
  question,
  options,
  player,
  index,
  total,
  onSubmit,
}: {
  cat: GameCategory;
  question: string;
  options?: string[];
  player: string;
  index: number;
  total: number;
  onSubmit: (v: Answer) => void;
}) {
  const [text, setText] = useState("");
  const [rankOrder, setRankOrder] = useState<number[]>(() => (options ? options.map((_, i) => i) : []));
  const parts = question.includes("||") ? question.split("||").map(s => s.trim()) : null;

  return (
    <div className="my-auto fade-up">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{player} - private answer</div>
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{index + 1} of {total}</div>
      </div>

      {parts && cat.mode === "binary" ? (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 flip-in">
          {parts.map((p, i) => (
            <button key={i} onClick={() => onSubmit(i)} className="group text-left aspect-[5/6] rounded-3xl hairline border bg-card p-7 md:p-10 magnetic relative overflow-hidden">
              <div className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ background: "radial-gradient(60% 60% at 30% 10%, rgba(255,255,255,0.08), transparent 60%)" }} />
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Choice {String.fromCharCode(65 + i)}</div>
              <div className="font-display text-3xl md:text-5xl mt-6 leading-[1.02] text-balance">{p}</div>
              <div className="absolute bottom-6 right-6 text-xs text-muted-foreground group-hover:text-foreground transition">Tap to choose</div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight max-w-4xl text-balance flip-in">{question}</h2>

          {cat.mode === "binary" && options && (
            <div className="mt-12 grid grid-cols-2 gap-3 md:gap-5 max-w-2xl">
              {options.map((o, i) => (
                <button key={o} onClick={() => onSubmit(i)} className="group h-28 md:h-32 rounded-2xl hairline border bg-card hover:bg-white/[0.04] transition magnetic relative overflow-hidden">
                  <div className="font-display text-2xl md:text-3xl">{o}</div>
                  <div className="absolute bottom-3 left-0 right-0 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Tap</div>
                </button>
              ))}
            </div>
          )}

          {cat.mode === "pick" && options && (
            <div className="mt-10 grid sm:grid-cols-2 gap-3 max-w-3xl">
              {options.map((o, i) => (
                <button key={o} onClick={() => onSubmit(i)} className="text-left rounded-2xl hairline border bg-card p-5 hover:bg-white/[0.04] transition magnetic">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-2">Option {String.fromCharCode(65 + i)}</div>
                  <div className="font-display text-xl md:text-2xl text-balance">{o}</div>
                </button>
              ))}
            </div>
          )}

          {cat.mode === "rank" && options && (
            <div className="mt-10 max-w-2xl">
              <div className="text-sm text-muted-foreground mb-4">Tap up/down to reorder. Top = most important.</div>
              <ul className="space-y-2">
                {rankOrder.map((optIdx, position) => (
                  <li key={optIdx} className="flex items-center gap-3 rounded-2xl hairline border bg-card px-4 py-3">
                    <span className="font-display text-xl tabular-nums w-8 text-muted-foreground">{position + 1}</span>
                    <span className="flex-1 text-base md:text-lg">{options[optIdx]}</span>
                    <button disabled={position === 0} onClick={() => setRankOrder(r => { const n = [...r]; [n[position - 1], n[position]] = [n[position], n[position - 1]]; return n; })} className="h-8 w-8 rounded-full hairline border grid place-items-center disabled:opacity-30 hover:bg-white/5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button disabled={position === rankOrder.length - 1} onClick={() => setRankOrder(r => { const n = [...r]; [n[position + 1], n[position]] = [n[position], n[position + 1]]; return n; })} className="h-8 w-8 rounded-full hairline border grid place-items-center disabled:opacity-30 hover:bg-white/5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => onSubmit(rankOrder)} className="btn-primary mt-6 magnetic">Lock in</button>
            </div>
          )}

          {(cat.mode === "open" || cat.mode === "dare") && (
            <div className="mt-10 max-w-2xl">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="Write freely. The reveal unlocks only when both sides are finished."
                className="w-full rounded-2xl hairline border bg-card p-5 text-base md:text-lg outline-none focus:border-white/20 transition resize-none"
              />
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{text.length} characters</div>
                <button disabled={text.trim().length < 1} onClick={() => onSubmit(text.trim())} className="btn-primary magnetic disabled:opacity-40 disabled:cursor-not-allowed">Save answer</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WaitingPhase({
  cat,
  round,
  profileId,
  onReveal,
  onClose,
}: {
  cat: GameCategory;
  round: SavedRound;
  profileId: ProfileId;
  onReveal: () => void;
  onClose: () => void;
}) {
  const partnerId = partnerOf(profileId);
  const meDone = (round[profileId]?.length ?? 0) >= cat.questions.length;
  const partnerDone = (round[partnerId]?.length ?? 0) >= cat.questions.length;

  return (
    <div className="my-auto fade-up max-w-2xl">
      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-6">Saved privately</div>
      <h2 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-tight text-balance">
        Waiting for the other side.
      </h2>
      <p className="mt-6 text-muted-foreground text-pretty">
        Your answers are saved. When {PROFILES[partnerId].name} finishes this same card, the reveal unlocks for both of you.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <StatusCard label={PROFILES[profileId].shortName} value={meDone ? "Complete" : "Waiting"} />
        <StatusCard label={PROFILES[partnerId].shortName} value={partnerDone ? "Complete" : "Waiting"} />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {meDone && partnerDone && <button onClick={onReveal} className="btn-primary magnetic">Reveal answers</button>}
        <button onClick={onClose} className="btn-ghost magnetic">Back to library</button>
      </div>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl hairline border bg-card p-5">
      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-2">{value}</div>
    </div>
  );
}

function isPerspectiveChoice(cat: GameCategory) {
  return cat.choices?.[0] === "You" && cat.choices?.[1] === "Me";
}

function answerProfile(cat: GameCategory, a: Answer, answererId: ProfileId) {
  if (!isPerspectiveChoice(cat) || typeof a !== "number") return null;
  if (a === 0) return partnerOf(answererId);
  if (a === 1) return answererId;
  return null;
}

function fmtAnswer(cat: GameCategory, a: Answer, options?: string[], answererId?: ProfileId) {
  if (answererId) {
    const pickedProfile = answerProfile(cat, a, answererId);
    if (pickedProfile) return PROFILES[pickedProfile].name;
  }
  if (cat.mode === "binary" || cat.mode === "pick") {
    if (typeof a === "number" && options) return options[a];
  }
  if (cat.mode === "rank" && Array.isArray(a) && options) {
    return a.map((idx, i) => `${i + 1}. ${options[idx]}`).join(" - ");
  }
  return String(a);
}

function getOptions(cat: GameCategory, index: number) {
  if (cat.mode === "binary") return cat.choices;
  if (cat.mode === "pick" || cat.mode === "rank") return cat.questionOptions?.[index] ?? cat.options;
  return undefined;
}

function isMatch(cat: GameCategory, a: Answer, b: Answer, aProfileId?: ProfileId, bProfileId?: ProfileId) {
  if (aProfileId && bProfileId && isPerspectiveChoice(cat)) {
    return answerProfile(cat, a, aProfileId) === answerProfile(cat, b, bProfileId);
  }
  if (cat.mode === "binary" || cat.mode === "pick") return a === b;
  if (cat.mode === "rank" && Array.isArray(a) && Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
  return false;
}

function RevealPhase({ cat, round, profileId, onDone }: { cat: GameCategory; round: SavedRound; profileId: ProfileId; onDone: () => void }) {
  const showMatch = cat.mode === "binary" || cat.mode === "pick" || cat.mode === "rank";
  const partnerId = partnerOf(profileId);
  const mine = round[profileId] ?? [];
  const theirs = round[partnerId] ?? [];
  const aligned = cat.questions.filter((_, i) => isMatch(cat, mine[i], theirs[i], profileId, partnerId)).length;

  return (
    <div className="my-auto fade-up">
      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-6">Reveal unlocked</div>
      <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-4xl text-balance">
        {showMatch ? `${aligned} matched. ${cat.questions.length - aligned} missed.` : "Both sides are in."}
      </h2>

      <div className="mt-10 space-y-4">
        {cat.questions.map((q, i) => {
          const options = getOptions(cat, i);
          const matched = isMatch(cat, mine[i], theirs[i], profileId, partnerId);
          return (
            <div key={`${q}-${i}`} className="rounded-3xl hairline border bg-card p-5 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Prompt {String(i + 1).padStart(2, "0")}</div>
                {showMatch && (
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${matched ? "bg-white" : "bg-white/30"}`} />
                    {matched ? "Matched" : "Missed"}
                  </div>
                )}
              </div>
              <h3 className="font-display text-2xl md:text-3xl mt-4 leading-tight">{q.replace("||", " / ")}</h3>
              <div className="mt-6 grid md:grid-cols-2 gap-3">
                <AnswerCard label={PROFILES[profileId].name} mono={PROFILES[profileId].initials} value={fmtAnswer(cat, mine[i], options, profileId)} />
                <AnswerCard label={PROFILES[partnerId].name} mono={PROFILES[partnerId].initials} value={fmtAnswer(cat, theirs[i], options, partnerId)} />
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onDone} className="btn-primary mt-10 magnetic">Finish</button>
    </div>
  );
}

function AnswerCard({ label, mono, value }: { label: string; mono: string; value: string }) {
  return (
    <div className="rounded-2xl hairline border bg-background/60 p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-white text-black grid place-items-center text-[11px] font-medium">{mono}</div>
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{label}</div>
      </div>
      <div className="mt-4 font-display text-2xl leading-tight text-balance">{value}</div>
    </div>
  );
}

function DonePhase({ cat, round, profileId, onReplay, onClose }: {
  cat: GameCategory;
  round: SavedRound;
  profileId: ProfileId;
  onReplay: () => void;
  onClose: () => void;
}) {
  const showScore = cat.mode === "binary" || cat.mode === "pick" || cat.mode === "rank";
  const partnerId = partnerOf(profileId);
  const mine = round[profileId] ?? [];
  const theirs = round[partnerId] ?? [];
  const aligned = cat.questions.filter((_, i) => isMatch(cat, mine[i], theirs[i], profileId, partnerId)).length;
  const pct = Math.round((aligned / cat.questions.length) * 100);

  return (
    <div className="my-auto fade-up">
      <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-6">End of session</div>
      <h2 className="font-display text-5xl md:text-7xl leading-[0.96] tracking-tight max-w-3xl text-balance">
        That was {showScore && pct >= 70 ? "remarkably aligned." : showScore && pct >= 40 ? "beautifully mixed." : "honest."}
      </h2>

      {showScore && (
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
          <Stat label="Matched" value={`${aligned}`} />
          <Stat label="Missed" value={`${cat.questions.length - aligned}`} />
          <Stat label="Score" value={`${pct}%`} />
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <button onClick={onReplay} className="btn-ghost magnetic">Start new round</button>
        <button onClick={onClose} className="btn-primary magnetic">Back to library</button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl hairline border bg-card px-4 py-5">
      <div className="font-display text-4xl tabular-nums">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{label}</div>
    </div>
  );
}
