import { FEEDBACK_STATUSES } from "../../../src/constants/feedback";
import { STUDIO_DEFAULT_STATUSES } from "../constants";
import { errorResponse, json, readJson } from "../http";
import { exists, listOldest, updateFeedback } from "../services/feedbackStore";
import type { Env } from "../types";
import { parseStatuses, validateFeedbackUpdate } from "../utils/validate";

export async function listStudioFeedback(url: URL, env: Env): Promise<Response> {
  const statuses = parseStatuses(url.searchParams.get("status") ?? STUDIO_DEFAULT_STATUSES, FEEDBACK_STATUSES);
  if (!statuses.ok) {
    return errorResponse(400, statuses.error);
  }
  return json({ items: await listOldest(env.DB, statuses.value) });
}

export async function patchFeedback(request: Request, id: number, env: Env): Promise<Response> {
  const changes = validateFeedbackUpdate(await readJson(request), id);
  if (!changes.ok) {
    return errorResponse(400, changes.error);
  }
  const duplicateOf = changes.value.duplicateOf;
  if (typeof duplicateOf === "number" && !(await exists(env.DB, duplicateOf))) {
    return errorResponse(400, `duplicateOf points to item ${duplicateOf}, which does not exist.`);
  }
  const item = await updateFeedback(env.DB, id, changes.value);
  if (item === null) {
    return errorResponse(404, "This feedback does not exist.");
  }
  return json({ item });
}
