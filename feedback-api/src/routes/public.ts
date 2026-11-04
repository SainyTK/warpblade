import { PUBLIC_FEEDBACK_STATUSES } from "../../../src/constants/feedback";
import { DAY_MS, HOUR_MS, POST_LIMITS, PUBLIC_LIST_LIMIT } from "../constants";
import { errorResponse, json, readJson } from "../http";
import { addVote, countRecentPosts, getVisible, insertFeedback, listNewest } from "../services/feedbackStore";
import { hashCallerIp } from "../services/ipHash";
import type { Env } from "../types";
import { parseStatuses, validateFeedbackPost } from "../utils/validate";

export async function listPublicFeedback(url: URL, env: Env): Promise<Response> {
  const statusQuery = url.searchParams.get("status");
  if (statusQuery === null) {
    return json({ items: await listNewest(env.DB, PUBLIC_FEEDBACK_STATUSES, PUBLIC_LIST_LIMIT) });
  }
  const statuses = parseStatuses(statusQuery, PUBLIC_FEEDBACK_STATUSES);
  if (!statuses.ok) {
    return errorResponse(400, statuses.error);
  }
  return json({ items: await listNewest(env.DB, statuses.value, PUBLIC_LIST_LIMIT) });
}

export async function getPublicFeedback(id: number, env: Env): Promise<Response> {
  const item = await getVisible(env.DB, id);
  if (item === null) {
    return errorResponse(404, "This feedback does not exist.");
  }
  return json({ item });
}

export async function postFeedback(request: Request, env: Env): Promise<Response> {
  const post = validateFeedbackPost(await readJson(request));
  if (!post.ok) {
    return errorResponse(400, post.error);
  }
  const ipHash = await hashCallerIp(request, env.IP_SALT);
  const now = Date.now();
  const recent = await countRecentPosts(
    env.DB,
    ipHash,
    new Date(now - HOUR_MS).toISOString(),
    new Date(now - DAY_MS).toISOString(),
  );
  if (recent.lastHour >= POST_LIMITS.perHour) {
    return errorResponse(
      429,
      `You can send ${POST_LIMITS.perHour} pieces of feedback an hour. Please try again later.`,
    );
  }
  if (recent.lastDay >= POST_LIMITS.perDay) {
    return errorResponse(
      429,
      `You can send ${POST_LIMITS.perDay} pieces of feedback a day. Please try again tomorrow.`,
    );
  }
  return json({ item: await insertFeedback(env.DB, post.value, ipHash) }, 201);
}

export async function voteForFeedback(request: Request, id: number, env: Env): Promise<Response> {
  const ipHash = await hashCallerIp(request, env.IP_SALT);
  const votes = await addVote(env.DB, id, ipHash);
  if (votes === null) {
    return errorResponse(404, "This feedback does not exist.");
  }
  return json({ votes });
}
