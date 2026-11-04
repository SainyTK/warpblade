import type { Feedback, FeedbackCategory, FeedbackStatus } from "../../../src/types/feedback";
import type { ValidFeedbackChanges, ValidFeedbackPost } from "../utils/validate";

/** Every column a Feedback is built from. The IP hash is left out so it never leaves the store. */
const FEEDBACK_COLUMNS =
  "id, created_at, updated_at, category, message, name, game_version, status, reply, patch, duplicate_of, votes";

interface FeedbackRow {
  id: number;
  created_at: string;
  updated_at: string;
  category: FeedbackCategory;
  message: string;
  name: string | null;
  game_version: string | null;
  status: FeedbackStatus;
  reply: string | null;
  patch: string | null;
  duplicate_of: number | null;
  votes: number;
}

function toFeedback(row: FeedbackRow): Feedback {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category,
    message: row.message,
    name: row.name,
    gameVersion: row.game_version,
    status: row.status,
    reply: row.reply,
    patch: row.patch,
    duplicateOf: row.duplicate_of,
    votes: row.votes,
  };
}

function placeholders(count: number): string {
  return Array.from({ length: count }, () => "?").join(", ");
}

/** Public list: newest first. */
export async function listNewest(
  db: D1Database,
  statuses: readonly FeedbackStatus[],
  limit: number,
): Promise<Feedback[]> {
  const { results } = await db
    .prepare(
      `SELECT ${FEEDBACK_COLUMNS} FROM feedback WHERE status IN (${placeholders(statuses.length)}) ORDER BY id DESC LIMIT ?`,
    )
    .bind(...statuses, limit)
    .all<FeedbackRow>();
  return results.map(toFeedback);
}

/** Studio work list: oldest first, so the earliest feedback is handled first. */
export async function listOldest(db: D1Database, statuses: readonly FeedbackStatus[]): Promise<Feedback[]> {
  const { results } = await db
    .prepare(
      `SELECT ${FEEDBACK_COLUMNS} FROM feedback WHERE status IN (${placeholders(statuses.length)}) ORDER BY id ASC`,
    )
    .bind(...statuses)
    .all<FeedbackRow>();
  return results.map(toFeedback);
}

/** Any item that is not hidden. */
export async function getVisible(db: D1Database, id: number): Promise<Feedback | null> {
  const row = await db
    .prepare(`SELECT ${FEEDBACK_COLUMNS} FROM feedback WHERE id = ? AND status != 'hidden'`)
    .bind(id)
    .first<FeedbackRow>();
  return row === null ? null : toFeedback(row);
}

export async function exists(db: D1Database, id: number): Promise<boolean> {
  const row = await db.prepare("SELECT 1 AS found FROM feedback WHERE id = ?").bind(id).first<{ found: number }>();
  return row !== null;
}

/** How many items one IP hash posted since each cutoff (ISO timestamps). */
export async function countRecentPosts(
  db: D1Database,
  ipHash: string,
  hourCutoff: string,
  dayCutoff: string,
): Promise<{ lastHour: number; lastDay: number }> {
  const row = await db
    .prepare(
      "SELECT COALESCE(SUM(created_at >= ?), 0) AS lastHour, COUNT(*) AS lastDay FROM feedback WHERE ip_hash = ? AND created_at >= ?",
    )
    .bind(hourCutoff, ipHash, dayCutoff)
    .first<{ lastHour: number; lastDay: number }>();
  return row ?? { lastHour: 0, lastDay: 0 };
}

export async function insertFeedback(db: D1Database, post: ValidFeedbackPost, ipHash: string): Promise<Feedback> {
  const row = await db
    .prepare(
      `INSERT INTO feedback (category, message, name, game_version, ip_hash) VALUES (?, ?, ?, ?, ?) RETURNING ${FEEDBACK_COLUMNS}`,
    )
    .bind(post.category, post.message, post.name, post.gameVersion, ipHash)
    .first<FeedbackRow>();
  if (row === null) {
    throw new Error("The feedback insert returned no row.");
  }
  return toFeedback(row);
}

/** Records one vote per IP hash and returns the item's vote count, or null when the item is missing or hidden. */
export async function addVote(db: D1Database, id: number, ipHash: string): Promise<number | null> {
  const item = await getVisible(db, id);
  if (item === null) {
    return null;
  }
  const [, counted] = await db.batch<{ votes: number }>([
    db.prepare("INSERT OR IGNORE INTO votes (feedback_id, ip_hash) VALUES (?, ?)").bind(id, ipHash),
    db
      .prepare(
        "UPDATE feedback SET votes = (SELECT COUNT(*) FROM votes WHERE feedback_id = ?) WHERE id = ? RETURNING votes",
      )
      .bind(id, id),
  ]);
  return counted?.results[0]?.votes ?? item.votes;
}

/** Applies an admin update and returns the changed item, or null when the id does not exist. */
export async function updateFeedback(
  db: D1Database,
  id: number,
  changes: ValidFeedbackChanges,
): Promise<Feedback | null> {
  const assignments = ["status = ?", "updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"];
  const values: (string | number | null)[] = [changes.status];
  if (changes.reply !== undefined) {
    assignments.push("reply = ?");
    values.push(changes.reply);
  }
  if (changes.patch !== undefined) {
    assignments.push("patch = ?");
    values.push(changes.patch);
  }
  if (changes.duplicateOf !== undefined) {
    assignments.push("duplicate_of = ?");
    values.push(changes.duplicateOf);
  }
  const row = await db
    .prepare(`UPDATE feedback SET ${assignments.join(", ")} WHERE id = ? RETURNING ${FEEDBACK_COLUMNS}`)
    .bind(...values, id)
    .first<FeedbackRow>();
  return row === null ? null : toFeedback(row);
}
