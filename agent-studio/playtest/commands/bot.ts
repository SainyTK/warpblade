import { playRun } from "../bots/playRun";
import { policyByName } from "../bots/policies";
import { launchHarness } from "../session/harness";
import type { BotFlags } from "../types/cli";
import type { BotMeans, BotReport, BotRun } from "../types/report";
import { secondsSince } from "../utils/elapsed";
import { heroIds } from "../utils/heroIds";
import { mean } from "../utils/mean";

const DETERMINISM =
  "Each run plays in a fresh browser context (empty storage, so no shop upgrades) with the game's seeded RNG and a fake " +
  "clock that only moves in fixed steps between bot decisions, so the same game code, hero, policy and run number give " +
  "the same run on any machine. Repeated runs of one hero therefore repeat each other; --runs above 1 only checks that. " +
  "Wall seconds depend on the machine. Sound effects use Math.random but do not touch play.";

function meansOf(hero: string, runs: readonly BotRun[]): BotMeans {
  return {
    hero,
    runs: runs.length,
    wave: mean(runs.map((run) => run.wave)),
    level: mean(runs.map((run) => run.level)),
    kills: mean(runs.map((run) => run.kills)),
    coins: mean(runs.map((run) => run.coins)),
    seconds: mean(runs.map((run) => run.seconds)),
  };
}

export async function bot(flags: BotFlags): Promise<BotReport> {
  const started = performance.now();
  const startedAt = new Date().toISOString();
  const policy = policyByName(flags.policy);
  const harness = await launchHarness(flags.root);
  const runs: BotRun[] = [];
  const pageErrors: string[] = [];
  try {
    const probe = await harness.newSession();
    const heroes = heroIds(flags.hero, await probe.heroes());
    await probe.close();
    for (const hero of heroes) {
      for (let index = 0; index < flags.runs; index++) {
        const session = await harness.newSession();
        const run = await playRun(session, hero, policy, flags.maxMinutes);
        console.error(`${hero} ${policy.name} run ${index + 1}: wave ${run.wave}, ${run.ending}, ${run.wallSeconds} s`);
        runs.push(run);
        pageErrors.push(...session.errors());
        await session.close();
      }
    }
  } finally {
    await harness.close();
  }
  const heroes = [...new Set(runs.map((run) => run.hero))];
  return {
    command: "bot",
    ok: pageErrors.length === 0,
    root: flags.root,
    startedAt,
    wallSeconds: secondsSince(started),
    pageErrors,
    policy: policy.name,
    runs,
    means: heroes.map((hero) =>
      meansOf(
        hero,
        runs.filter((run) => run.hero === hero),
      ),
    ),
    determinism: DETERMINISM,
  };
}
