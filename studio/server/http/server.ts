import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { RunBusyError } from '../services/agentRun';
import type { JobService } from '../services/jobs';
import type { SketchStore } from '../services/sketches';
import { StudioError } from '../utils/errors';
import {
  parseDecision,
  parseJobRequest,
  parseMode,
  parseSketch,
  parseTurn,
} from '../utils/validate';
import { BodyError, readJson } from './body';
import { streamEvents } from './events';
import { error, image, json } from './respond';

const ID = '([a-z0-9-]{1,64})';
const SKETCH = new RegExp(`^/api/sketches/${ID}$`);
const JOB = new RegExp(`^/api/jobs/${ID}$`);
const JOB_EVENTS = new RegExp(`^/api/jobs/${ID}/events$`);
const JOB_MEDIA = new RegExp(`^/api/jobs/${ID}/media/([a-z0-9.-]{1,90})$`);
const JOB_ACTION = new RegExp(`^/api/jobs/${ID}/(turns|stop|mode|preview)$`);
const JOB_APPROVAL = new RegExp(`^/api/jobs/${ID}/approvals/([A-Za-z0-9_-]{1,200})$`);

export interface Services {
  jobs: JobService;
  sketches: SketchStore;
}

async function getRoute(services: Services, res: ServerResponse, url: URL): Promise<void> {
  const { jobs, sketches } = services;
  const path = url.pathname;
  if (path === '/api/settings') {
    return json(res, 200, await jobs.settings());
  }
  if (path === '/api/sketches') {
    return json(res, 200, await sketches.list());
  }
  if (path === '/api/jobs') {
    return json(res, 200, jobs.list());
  }
  let match = SKETCH.exec(path);
  if (match?.[1]) {
    return json(res, 200, await sketches.get(match[1]));
  }
  match = JOB.exec(path);
  if (match?.[1]) {
    return json(res, 200, jobs.view(match[1]));
  }
  match = JOB_EVENTS.exec(path);
  if (match?.[1]) {
    const after = Number(url.searchParams.get('after') ?? '0');
    return streamEvents(
      res,
      jobs.channel(match[1]),
      url.searchParams.get('epoch') ?? '',
      Number.isInteger(after) ? after : -1,
    );
  }
  match = JOB_MEDIA.exec(path);
  if (match?.[1] && match[2]) {
    const found = await jobs.media(match[1], match[2]);
    return image(res, found.mediaType, found.data);
  }
  error(res, 404, 'Not found.');
}

async function writeRoute(
  services: Services,
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
): Promise<void> {
  const { jobs, sketches } = services;
  const path = url.pathname;
  const sketch = SKETCH.exec(path);
  if (sketch?.[1] && req.method === 'PUT') {
    const body = parseSketch(await readJson(req));
    if (body.id !== sketch[1]) {
      throw new StudioError(400, 'The sketch ID does not match.');
    }
    return json(res, 200, await sketches.save(body));
  }
  if (sketch?.[1] && req.method === 'DELETE') {
    await sketches.remove(sketch[1]);
    return json(res, 200, { ok: true });
  }
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed.');
  }
  if (path === '/api/jobs') {
    return json(res, 202, await jobs.create(parseJobRequest(await readJson(req))));
  }
  const approval = JOB_APPROVAL.exec(path);
  if (approval?.[1] && approval[2]) {
    jobs.decide(approval[1], approval[2], parseDecision(await readJson(req)));
    return json(res, 200, { ok: true });
  }
  const action = JOB_ACTION.exec(path);
  if (!action?.[1]) {
    return error(res, 404, 'Not found.');
  }
  const [, id, name] = action;
  if (name === 'turns') {
    await jobs.turn(id, parseTurn(await readJson(req)));
  } else if (name === 'stop') {
    await jobs.stop(id);
  } else if (name === 'mode') {
    await jobs.mode(id, parseMode(await readJson(req)));
  } else if (url.searchParams.get('action') === 'stop') {
    jobs.stopPreview(id);
  } else {
    return json(res, 200, await jobs.startPreview(id));
  }
  json(res, 200, { ok: true });
}

function statusOf(problem: unknown): { status: number; message: string } {
  if (problem instanceof StudioError || problem instanceof BodyError) {
    return { status: problem.status, message: problem.message };
  }
  if (problem instanceof RunBusyError) {
    return { status: 409, message: problem.message };
  }
  return { status: 500, message: 'The studio could not complete the request.' };
}

/**
 * The studio's loopback API. Writes must come from the studio page's own origin, so another site open
 * in the browser cannot start agents.
 */
export function studioServer(services: Services, origins: string[]): Server {
  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://studio.local');
    const write = req.method !== 'GET';
    const origin = req.headers.origin;
    if (write && (typeof origin !== 'string' || !origins.includes(origin))) {
      return error(res, 403, 'Writes must come from the studio page.');
    }
    const handled = write ? writeRoute(services, req, res, url) : getRoute(services, res, url);
    handled.catch((problem: unknown) => {
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
