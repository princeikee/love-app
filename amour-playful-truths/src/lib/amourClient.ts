import { getAmourSnapshotFn, markCategorySeenFn, saveProfileAnswersFn } from "./amourServerFns";
import type { AmourActivity, AmourSnapshot, Answer, ProfileId, SavedRound } from "./amourTypes";

const roundsKey = "amour:rounds";
const activityKey = "amour:activity";
const seenKey = (profileId: ProfileId) => `amour:seen:${profileId}`;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(window.localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function localSnapshot(profileId: ProfileId): AmourSnapshot {
  return {
    rounds: readJson<Record<string, SavedRound>>(roundsKey, {}),
    activities: readJson<AmourActivity[]>(activityKey, []),
    seenQuestionCounts: readJson<Record<string, number>>(seenKey(profileId), {}),
    source: "local",
  };
}

function rememberActivity(activity: AmourActivity) {
  const activities = readJson<AmourActivity[]>(activityKey, []);
  writeJson(activityKey, [activity, ...activities].slice(0, 24));
}

export async function loadAmourSnapshot(profileId: ProfileId): Promise<AmourSnapshot> {
  try {
    return await getAmourSnapshotFn({ data: { profileId } });
  } catch {
    return localSnapshot(profileId);
  }
}

export async function saveProfileAnswers(input: {
  profileId: ProfileId;
  categoryId: string;
  categoryTitle: string;
  answers: Answer[];
  questionCount: number;
}) {
  try {
    return await saveProfileAnswersFn({ data: input });
  } catch {
    const rounds = readJson<Record<string, SavedRound>>(roundsKey, {});
    const nextRound = { ...(rounds[input.categoryId] ?? {}), [input.profileId]: input.answers };
    writeJson(roundsKey, { ...rounds, [input.categoryId]: nextRound });
    rememberActivity({
      id: `${Date.now()}`,
      actor: input.profileId,
      categoryId: input.categoryId,
      action: "completed",
      summary: `finished ${input.categoryTitle}`,
      createdAt: new Date().toISOString(),
    });
    return nextRound;
  }
}

export async function markCategorySeen(input: {
  profileId: ProfileId;
  categoryId: string;
  questionCount: number;
}) {
  try {
    await markCategorySeenFn({ data: input });
  } catch {
    const seen = readJson<Record<string, number>>(seenKey(input.profileId), {});
    writeJson(seenKey(input.profileId), { ...seen, [input.categoryId]: input.questionCount });
  }
}
