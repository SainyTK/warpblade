import { errorResponse, preflight, withCors } from "./http";
import { listStudioFeedback, patchFeedback } from "./routes/admin";
import { getPublicFeedback, listPublicFeedback, postFeedback, voteForFeedback } from "./routes/public";
import { hasAdminToken } from "./services/adminToken";
import type { Env } from "./types";
import { parseId } from "./utils/validate";

const BASE_PATH = "/api/feedback";
const ADMIN_PATH = `${BASE_PATH}/admin/items`;
const NOT_FOUND = "There is nothing at this address.";
const METHOD_NOT_ALLOWED = "This address does not accept that method.";
const BAD_ID = "The feedback id must be a positive whole number.";

async function routeAdmin(request: Request, url: URL, env: Env): Promise<Response> {
  if (!(await hasAdminToken(request, env.ADMIN_TOKEN))) {
    return errorResponse(401, "A valid admin token is required.");
  }
  const rest = url.pathname.slice(ADMIN_PATH.length);
  if (rest === "") {
    return request.method === "GET" ? listStudioFeedback(url, env) : errorResponse(405, METHOD_NOT_ALLOWED);
  }
  const id = parseId(rest.slice(1));
  if (!rest.startsWith("/") || id === null) {
    return errorResponse(404, NOT_FOUND);
  }
  return request.method === "PATCH" ? patchFeedback(request, id, env) : errorResponse(405, METHOD_NOT_ALLOWED);
}

async function routePublic(request: Request, url: URL, env: Env): Promise<Response> {
  const segments = url.pathname.slice(BASE_PATH.length).split("/").filter(Boolean);
  if (segments.length === 0) {
    if (request.method === "GET") {
      return listPublicFeedback(url, env);
    }
    if (request.method === "POST") {
      return postFeedback(request, env);
    }
    return errorResponse(405, METHOD_NOT_ALLOWED);
  }
  if (segments.length > 2 || (segments.length === 2 && segments[1] !== "vote")) {
    return errorResponse(404, NOT_FOUND);
  }
  const id = parseId(segments[0] ?? "");
  if (id === null) {
    return errorResponse(400, BAD_ID);
  }
  if (segments.length === 2) {
    return request.method === "POST" ? voteForFeedback(request, id, env) : errorResponse(405, METHOD_NOT_ALLOWED);
  }
  return request.method === "GET" ? getPublicFeedback(id, env) : errorResponse(405, METHOD_NOT_ALLOWED);
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname !== BASE_PATH && !url.pathname.startsWith(`${BASE_PATH}/`)) {
    return errorResponse(404, NOT_FOUND);
  }
  if (request.method === "OPTIONS") {
    return preflight(request);
  }
  if (url.pathname === ADMIN_PATH || url.pathname.startsWith(`${ADMIN_PATH}/`)) {
    return routeAdmin(request, url, env);
  }
  return routePublic(request, url, env);
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      return withCors(request, await route(request, env));
    } catch (error) {
      console.error(error);
      return withCors(request, errorResponse(500, "Something went wrong on our side. Please try again later."));
    }
  },
} satisfies ExportedHandler<Env>;
