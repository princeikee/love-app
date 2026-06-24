import { createServerFn } from "@tanstack/react-start";
import type { Answer, ProfileId } from "./amourTypes";

function asProfileId(value: unknown): ProfileId {
  if (value === "mr-babe" || value === "nom-nom-princess") return value;
  throw new Error("Invalid profile");
}

export const getAmourSnapshotFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const input = data as { profileId?: unknown } | undefined;
    return { profileId: asProfileId(input?.profileId) };
  })
  .handler(async ({ data }) => {
    const db = await import("./amourDb.server");
    return db.getAmourSnapshot(data.profileId);
  });

export const saveProfileAnswersFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = data as {
      profileId?: unknown;
      categoryId?: unknown;
      categoryTitle?: unknown;
      answers?: unknown;
      questionCount?: unknown;
    } | undefined;

    if (typeof input?.categoryId !== "string") throw new Error("Invalid category");
    if (typeof input.categoryTitle !== "string") throw new Error("Invalid title");
    if (!Array.isArray(input.answers)) throw new Error("Invalid answers");
    if (typeof input.questionCount !== "number") throw new Error("Invalid question count");

    return {
      profileId: asProfileId(input.profileId),
      categoryId: input.categoryId,
      categoryTitle: input.categoryTitle,
      answers: input.answers as Answer[],
      questionCount: input.questionCount,
    };
  })
  .handler(async ({ data }) => {
    const db = await import("./amourDb.server");
    return db.saveProfileAnswers(data);
  });

export const markCategorySeenFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = data as {
      profileId?: unknown;
      categoryId?: unknown;
      questionCount?: unknown;
    } | undefined;

    if (typeof input?.categoryId !== "string") throw new Error("Invalid category");
    if (typeof input.questionCount !== "number") throw new Error("Invalid question count");

    return {
      profileId: asProfileId(input.profileId),
      categoryId: input.categoryId,
      questionCount: input.questionCount,
    };
  })
  .handler(async ({ data }) => {
    const db = await import("./amourDb.server");
    await db.markCategorySeen(data);
    return { ok: true };
  });