import { launchHarness } from "../session/harness";
import type { SmokeFlags } from "../types/cli";
import type { Check, SmokeReport } from "../types/report";
import { secondsSince } from "../utils/elapsed";
import { heroIds } from "../utils/heroIds";
import { smokeHero } from "./smokeHero";
import { smokePages } from "./smokePages";

export async function smoke(flags: SmokeFlags): Promise<SmokeReport> {
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const harness = await launchHarness(flags.root);
  const checks: Check[] = [];
  const pageErrors: string[] = [];
  let heroes: string[] = [];
  try {
    const title = await harness.newSession();
    const state = await title.state();
    const found = await title.heroes();
    checks.push({ name: "start menu opens", ok: state.menu.context === "title", detail: `menu "${state.menu.title}"` });
    checks.push({ name: "heroes found", ok: found.length > 0, detail: found.map((h) => h.id).join(", ") });
    pageErrors.push(...title.errors());
    await title.close();
    heroes = heroIds(flags.hero, found);
    for (const hero of heroes) {
      const session = await harness.newSession();
      checks.push(...(await smokeHero(session, hero)));
      pageErrors.push(...session.errors());
      await session.close();
    }
    checks.push(...(await smokePages(harness)));
  } finally {
    await harness.close();
  }
  return {
    command: "smoke",
    ok: checks.every((check) => check.ok),
    root: flags.root,
    startedAt,
    wallSeconds: secondsSince(started),
    pageErrors,
    heroes,
    checks,
  };
}
