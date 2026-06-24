export type ProfileId = "mr-babe" | "nom-nom-princess";

export type Answer = string | number | number[];

export type SavedRound = Partial<Record<ProfileId, Answer[]>>;

export type ActivityAction = "answered" | "completed" | "seen";

export type AmourActivity = {
  id: string;
  actor: ProfileId;
  categoryId: string;
  action: ActivityAction;
  summary: string;
  createdAt: string;
};

export type AmourSnapshot = {
  rounds: Record<string, SavedRound>;
  activities: AmourActivity[];
  seenQuestionCounts: Record<string, number>;
  source: "postgres" | "local";
};

export const PROFILES: Record<ProfileId, {
  id: ProfileId;
  name: string;
  shortName: string;
  passcode: string;
  initials: string;
  image: string;
  note: string;
}> = {
  "mr-babe": {
    id: "mr-babe",
    name: "Mr Babe",
    shortName: "Mr Babe",
    passcode: "4123",
    initials: "MB",
    image: "/images/mr-babe.jpg",
    note: "The one who makes ordinary nights feel chosen.",
  },
  "nom-nom-princess": {
    id: "nom-nom-princess",
    name: "Nom Nom Princess",
    shortName: "Princess",
    passcode: "5123",
    initials: "NP",
    image: "/images/nom-nom-princess.jpg",
    note: "Soft heart, sharp laugh, forever the main character here.",
  },
};

export function partnerOf(profileId: ProfileId): ProfileId {
  return profileId === "mr-babe" ? "nom-nom-princess" : "mr-babe";
}
