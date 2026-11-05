import { EXTRA_PAGES } from "../constants/game";
import { fetchText } from "../services/http";
import type { Harness } from "../session/harness";
import type { Check } from "../types/report";

const SETTLE_MS = 1_500;
/** browser messages about a request to another service that failed or was refused, such as an API not running */
const NETWORK_ERROR = /CORS policy|net::ERR_/;

interface PageErrors {
  errors: string[];
  network: string[];
}

async function loadPage(harness: Harness, url: string): Promise<PageErrors> {
  const page = await harness.newPage();
  const seen: PageErrors = { errors: [], network: [] };
  page.on("pageerror", (error) => seen.errors.push(`page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }
    const list = NETWORK_ERROR.test(message.text()) ? seen.network : seen.errors;
    list.push(`console error: ${message.text()}`);
  });
  try {
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(SETTLE_MS);
  } finally {
    await page.context().close();
  }
  return seen;
}

/** errors fail the check; failed requests to other services are noted only, as they depend on what else runs */
function detail(seen: PageErrors): string | undefined {
  const notes = [...seen.errors];
  if (seen.network.length > 0) {
    notes.push(`not counted, requests to other services failed: ${seen.network.join(" | ")}`);
  }
  return notes.join(" | ") || undefined;
}

/** each extra page that exists loads without errors; a page not built yet is skipped */
export async function smokePages(harness: Harness): Promise<Check[]> {
  const base = harness.url();
  const game = await fetchText(`${base}/`);
  const checks: Check[] = [];
  for (const path of EXTRA_PAGES) {
    const name = `${path} loads without errors`;
    const page = await fetchText(`${base}${path}`);
    if (page.status === 404 || page.text === game.text) {
      checks.push({ name, ok: true, skipped: true, detail: "not built yet: the dev server has no such page" });
      continue;
    }
    if (page.status !== 200) {
      checks.push({ name, ok: false, detail: `HTTP ${page.status}` });
      continue;
    }
    const seen = await loadPage(harness, `${base}${path}`);
    checks.push({ name, ok: seen.errors.length === 0, detail: detail(seen) });
  }
  return checks;
}
