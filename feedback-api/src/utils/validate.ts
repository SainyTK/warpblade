import { FEEDBACK_CATEGORIES, FEEDBACK_LIMITS, FEEDBACK_STATUSES } from "../../../src/constants/feedback";
import type { FeedbackCategory, FeedbackStatus } from "../../../src/types/feedback";
import { GAME_VERSION_MAX } from "../constants";

export type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

/** A new post after validation, ready to store. */
export interface ValidFeedbackPost {
  category: FeedbackCategory;
  message: string;
  name: string | null;
  gameVersion: string | null;
}

/** The fields an admin update changes; a missing field stays as it is. */
export interface ValidFeedbackChanges {
  status: FeedbackStatus;
  reply?: string | null;
  patch?: string | null;
  duplicateOf?: number | null;
}

const SEMVER = /^\d+\.\d+\.\d+$/;
const POSITIVE_INTEGER = /^[1-9]\d*$/;

function fail<T>(error: string): Validated<T> {
  return { ok: false, error };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCategory(value: unknown): value is FeedbackCategory {
  return FEEDBACK_CATEGORIES.some((category) => category === value);
}

function isStatus(value: unknown): value is FeedbackStatus {
  return FEEDBACK_STATUSES.some((status) => status === value);
}

/** An optional text field: missing or blank becomes null, anything longer than `max` is an error. */
function optionalText(value: unknown, max: number, label: string): Validated<string | null> {
  if (value === undefined || value === null) {
    return { ok: true, value: null };
  }
  if (typeof value !== "string") {
    return fail(`The ${label} must be text.`);
  }
  const text = value.trim();
  if (text.length > max) {
    return fail(`The ${label} can be at most ${max} characters.`);
  }
  return { ok: true, value: text === "" ? null : text };
}

/** A positive whole number from a URL segment, or null. */
export function parseId(segment: string): number | null {
  if (!POSITIVE_INTEGER.test(segment)) {
    return null;
  }
  const id = Number(segment);
  return Number.isSafeInteger(id) ? id : null;
}

export function validateFeedbackPost(body: unknown): Validated<ValidFeedbackPost> {
  if (!isRecord(body)) {
    return fail("Send the feedback as a JSON object.");
  }
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return fail("This feedback could not be sent.");
  }
  if (!isCategory(body.category)) {
    return fail(`Choose a category: ${FEEDBACK_CATEGORIES.join(", ")}.`);
  }
  if (typeof body.message !== "string") {
    return fail("Write a message.");
  }
  const message = body.message.trim();
  if (message.length < FEEDBACK_LIMITS.messageMin) {
    return fail(`The message needs at least ${FEEDBACK_LIMITS.messageMin} characters.`);
  }
  if (message.length > FEEDBACK_LIMITS.messageMax) {
    return fail(`The message can be at most ${FEEDBACK_LIMITS.messageMax} characters.`);
  }
  const name = optionalText(body.name, FEEDBACK_LIMITS.nameMax, "name");
  if (!name.ok) {
    return name;
  }
  const gameVersion = optionalText(body.gameVersion, GAME_VERSION_MAX, "game version");
  if (!gameVersion.ok) {
    return gameVersion;
  }
  return { ok: true, value: { category: body.category, message, name: name.value, gameVersion: gameVersion.value } };
}

/** Parses a comma-separated status list; every entry must be one of `allowed`. */
export function parseStatuses(query: string, allowed: readonly FeedbackStatus[]): Validated<FeedbackStatus[]> {
  const statuses: FeedbackStatus[] = [];
  for (const entry of query.split(",")) {
    const status = entry.trim();
    const match = allowed.find((candidate) => candidate === status);
    if (match === undefined) {
      return fail(`Unknown status "${status}". Use one of: ${allowed.join(", ")}.`);
    }
    statuses.push(match);
  }
  return { ok: true, value: statuses };
}

export function validateFeedbackUpdate(body: unknown, id: number): Validated<ValidFeedbackChanges> {
  if (!isRecord(body)) {
    return fail("Send the update as a JSON object.");
  }
  if (!isStatus(body.status)) {
    return fail(`Choose a status: ${FEEDBACK_STATUSES.join(", ")}.`);
  }
  const changes: ValidFeedbackChanges = { status: body.status };
  if (body.reply !== undefined) {
    const reply = optionalText(body.reply, FEEDBACK_LIMITS.replyMax, "reply");
    if (!reply.ok) {
      return reply;
    }
    changes.reply = reply.value;
  }
  if (body.patch !== undefined) {
    if (body.patch !== null && (typeof body.patch !== "string" || !SEMVER.test(body.patch))) {
      return fail("The patch must be a version like 1.4.0, or null.");
    }
    changes.patch = body.patch;
  }
  if (body.duplicateOf !== undefined) {
    if (
      body.duplicateOf !== null &&
      (typeof body.duplicateOf !== "number" || !Number.isSafeInteger(body.duplicateOf))
    ) {
      return fail("duplicateOf must be the id of another feedback item, or null.");
    }
    if (body.duplicateOf === id) {
      return fail("An item cannot be a duplicate of itself.");
    }
    changes.duplicateOf = body.duplicateOf;
  }
  if (changes.status === "duplicate" && (changes.duplicateOf === undefined || changes.duplicateOf === null)) {
    return fail("A duplicate needs duplicateOf, the id of the original item.");
  }
  return { ok: true, value: changes };
}
