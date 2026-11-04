/** the deployed feedback API; the dev server talks to `wrangler dev` in feedback-api/ */
export const FEEDBACK_API = import.meta.env.DEV
  ? "http://localhost:8787"
  : "https://warpblade-feedback.my-worker-signal.workers.dev";
