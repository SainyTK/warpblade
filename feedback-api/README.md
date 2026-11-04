# Warpblade feedback API

A Cloudflare Worker (`warpblade-feedback`) that stores player feedback for Warpblade in a D1 database (`warpblade-feedback`).
Players post and vote from the game site, cross-origin.
The agent studio on the owner's Mac reads new feedback each night and sets status, reply and patch with an admin bearer token.

The shared types and constants live in `../src/types/feedback.ts` and `../src/constants/feedback.ts`, and the Worker imports them from there.

## Why D1

D1 is SQLite, so the Worker can filter by status, sort, rate limit with an indexed query and count votes atomically.
R2 was considered first, but it is object storage with no queries or atomic updates, which fits poorly for a status-filtered list with votes and edits.

## Run locally

```sh
npm install
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev
```

The API then answers on http://localhost:8787/api/feedback.
Local data lives in `.wrangler/`, which is git-ignored.
The game's Vite dev server (port 5173) and `vite preview` (port 4173) on `localhost` and `127.0.0.1` are allowed origins.

`npm run typecheck`, `npm run lint` and `npm run format` check and format the code.

## Deploy

The owner runs these steps once, logged in to Cloudflare with `npx wrangler login`.

1. Create the database with `npx wrangler d1 create warpblade-feedback`.
2. Put the printed `database_id` into `wrangler.jsonc` in place of the zero placeholder.
3. Create the tables with `npm run db:migrate:remote`.
4. Set the secrets with `npx wrangler secret put ADMIN_TOKEN` and `npx wrangler secret put IP_SALT`, using long random values.
5. Deploy with `npm run deploy`.

The Worker is then live at https://warpblade-feedback.my-worker-signal.workers.dev.
Later schema changes go in a new file under `migrations/` and ship with `npm run db:migrate:remote` before the deploy.

## API

All bodies are JSON.
Errors come back as `{ "error": "..." }` with a plain sentence.
The IP hash is never returned.

| Method | Path | Access | Result |
| --- | --- | --- | --- |
| GET | `/api/feedback` | public | `{ items }` with public statuses, newest first, at most 200. `?status=planned` (comma list allowed) filters to public statuses only. |
| GET | `/api/feedback/:id` | public | `{ item }` for any status except `hidden`, otherwise 404. |
| POST | `/api/feedback` | public | Body `NewFeedback`, returns 201 `{ item }`. 400 on invalid input or a filled honeypot, 429 over 5 posts an hour or 20 a day per player. |
| POST | `/api/feedback/:id/vote` | public | `{ votes }`. One vote per player per item, so repeating it changes nothing. 404 for hidden items. |
| GET | `/api/feedback/admin/items` | admin | `{ items }` oldest first. `?status=` takes any statuses, comma separated, default `new,planned`. |
| PATCH | `/api/feedback/admin/items/:id` | admin | Body `FeedbackUpdate`, returns `{ item }` and sets `updatedAt`. Fields left out stay as they are. |

Admin routes need `Authorization: Bearer <ADMIN_TOKEN>` and return 401 without it.
A player is identified by a SHA-256 hash of `CF-Connecting-IP` salted with `IP_SALT`.

Validation follows `FEEDBACK_LIMITS` in the shared constants.
The message is trimmed and must be 10 to 1000 characters.
The name can be up to 40 characters, and a blank name is stored as null.
The game version can be up to 20 characters.
A reply can be up to 600 characters.
A patch is a version like `1.4.0`, or null.
`duplicateOf` must be the id of another existing item, or null, and status `duplicate` requires it.
