import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { DraftStore } from '../services/drafts';
import { StudioError } from '../utils/errors';
import { BodyError, readJson } from './body';
import { error, json } from './respond';

const DRAFTS = '/api/drafts';
const DRAFT = /^\/api\/drafts\/([a-z]+\/[a-zA-Z0-9]+(?:\/[a-zA-Z0-9]+)?)$/;

async function route(drafts: DraftStore, req: IncomingMessage, res: ServerResponse, path: string) {
  if (req.method === 'GET' && path === DRAFTS) {
    return json(res, 200, await drafts.list());
  }
  const clip = DRAFT.exec(path)?.[1];
  if (clip && req.method === 'PUT') {
    return json(res, 200, await drafts.save(clip, await readJson(req)));
  }
  error(res, 404, 'Not found.');
}

function statusOf(problem: unknown): { status: number; message: string } {
  if (problem instanceof StudioError || problem instanceof BodyError) {
    return { status: problem.status, message: problem.message };
  }
  return { status: 500, message: 'The studio could not complete the request.' };
}

/** The studio's loopback API. Writes must come from the studio page's own origin. */
export function studioServer(drafts: DraftStore, origins: string[]): Server {
  return createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://studio.local').pathname;
    const origin = req.headers.origin;
    if (req.method !== 'GET' && (typeof origin !== 'string' || !origins.includes(origin))) {
      return error(res, 403, 'Writes must come from the studio page.');
    }
    route(drafts, req, res, path).catch((problem: unknown) => {
      const { status, message } = statusOf(problem);
      if (status === 500) {
        console.error('studio request failed:', problem);
      }
      if (res.headersSent) {
        res.destroy();
      } else {
        error(res, status, message);
      }
      req.resume();
    });
  });
}
