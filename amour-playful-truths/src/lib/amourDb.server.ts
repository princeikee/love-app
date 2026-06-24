import pg from "pg";
import type { ActivityAction, AmourActivity, AmourSnapshot, Answer, ProfileId, SavedRound } from "./amourTypes";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let ready: Promise<void> | null = null;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

async function ensureSchema() {
  if (!ready) {
    ready = getPool().query(`
      create table if not exists amour_rounds (
        category_id text primary key,
        answers jsonb not null default '{}'::jsonb,
        question_count integer not null,
        updated_at timestamptz not null default now()
      );

      create table if not exists amour_seen (
        profile_id text not null,
        category_id text not null,
        question_count integer not null,
        seen_at timestamptz not null default now(),
        primary key (profile_id, category_id)
      );

      create table if not exists amour_activity (
        id bigserial primary key,
        actor text not null,
        category_id text not null,
        action text not null,
        summary text not null,
        created_at timestamptz not null default now()
      );
    `).then(() => undefined);
  }
  return ready;
}

function normalizeRound(value: unknown): SavedRound {
  if (!value || typeof value !== "object") return {};
  return value as SavedRound;
}

function activityFromRow(row: {
  id: string | number;
  actor: ProfileId;
  category_id: string;
  action: ActivityAction;
  summary: string;
  created_at: Date | string;
}): AmourActivity {
  return {
    id: String(row.id),
    actor: row.actor,
    categoryId: row.category_id,
    action: row.action,
    summary: row.summary,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getAmourSnapshot(profileId: ProfileId): Promise<AmourSnapshot> {
  await ensureSchema();
  const client = getPool();
  const [roundsResult, activityResult, seenResult] = await Promise.all([
    client.query("select category_id, answers from amour_rounds"),
    client.query(
      "select id, actor, category_id, action, summary, created_at from amour_activity order by created_at desc limit 24",
    ),
    client.query("select category_id, question_count from amour_seen where profile_id = $1", [profileId]),
  ]);

  const rounds: Record<string, SavedRound> = {};
  for (const row of roundsResult.rows) {
    rounds[row.category_id] = normalizeRound(row.answers);
  }

  const seenQuestionCounts: Record<string, number> = {};
  for (const row of seenResult.rows) {
    seenQuestionCounts[row.category_id] = row.question_count;
  }

  return {
    rounds,
    activities: activityResult.rows.map(activityFromRow),
    seenQuestionCounts,
    source: "postgres",
  };
}

export async function saveProfileAnswers(input: {
  profileId: ProfileId;
  categoryId: string;
  categoryTitle: string;
  answers: Answer[];
  questionCount: number;
}) {
  await ensureSchema();
  const client = getPool();
  const existing = await client.query("select answers from amour_rounds where category_id = $1", [input.categoryId]);
  const answers = normalizeRound(existing.rows[0]?.answers);
  const nextAnswers = { ...answers, [input.profileId]: input.answers };

  await client.query(
    `insert into amour_rounds (category_id, answers, question_count, updated_at)
     values ($1, $2::jsonb, $3, now())
     on conflict (category_id)
     do update set answers = excluded.answers, question_count = excluded.question_count, updated_at = now()`,
    [input.categoryId, JSON.stringify(nextAnswers), input.questionCount],
  );

  await client.query(
    `insert into amour_activity (actor, category_id, action, summary)
     values ($1, $2, $3, $4)`,
    [input.profileId, input.categoryId, "completed", `finished ${input.categoryTitle}`],
  );

  return nextAnswers;
}

export async function markCategorySeen(input: {
  profileId: ProfileId;
  categoryId: string;
  questionCount: number;
}) {
  await ensureSchema();
  await getPool().query(
    `insert into amour_seen (profile_id, category_id, question_count, seen_at)
     values ($1, $2, $3, now())
     on conflict (profile_id, category_id)
     do update set question_count = excluded.question_count, seen_at = now()`,
    [input.profileId, input.categoryId, input.questionCount],
  );
}
