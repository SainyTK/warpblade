import type { Harness } from "../../session/harness";
import type { Session } from "../../types/session";
import { PRESS_PAIRS, PRESS_TIMINGS, PRESSES_START, RESPONSE_ACTIONS, RESPONSE_PHASES, SETTLE_MS } from "./constants";
import { pairTrial } from "./pairTrial";
import { readFighter } from "./readFighter";
import { resetPosition } from "./resetPosition";
import { responseTrial } from "./responseTrial";
import { sessionClean } from "./sessionClean";
import type { HeroPresses, PairTrial, ResponseTrial } from "./types";

export async function benchHero(harness: Harness, hero: string): Promise<HeroPresses> {
  const open = async (): Promise<Session> => {
    const opened = await harness.newSession({ hero, start: PRESSES_START });
    await opened.advance(SETTLE_MS);
    return opened;
  };
  let session = await open();
  const errors: string[] = [];
  let reopens = 0;
  try {
    const home = (await readFighter(session)).x;
    const reopen = async (): Promise<void> => {
      reopens++;
      errors.push(...session.errors());
      await session.close();
      session = await open();
    };
    const ready = async (fresh: boolean): Promise<void> => {
      if (fresh || !sessionClean(await session.state())) {
        await reopen();
      }
      await resetPosition(session, home);
      if (!sessionClean(await session.state())) {
        await reopen();
        await resetPosition(session, home);
      }
    };
    const pairs: PairTrial[] = [];
    for (const timing of PRESS_TIMINGS) {
      for (const [first, second] of PRESS_PAIRS) {
        await ready(false);
        let trial = await pairTrial(session, hero, first, second, timing);
        if (!trial.firstStarted || trial.disturbed) {
          await ready(true);
          trial = { ...(await pairTrial(session, hero, first, second, timing)), retried: true };
        }
        pairs.push(trial);
      }
    }
    const responses: ResponseTrial[] = [];
    for (const action of RESPONSE_ACTIONS) {
      for (const phase of RESPONSE_PHASES) {
        await ready(false);
        let timing = await responseTrial(session, action, phase);
        let retried = false;
        if (timing.disturbed) {
          await ready(true);
          timing = await responseTrial(session, action, phase);
          retried = true;
        }
        responses.push({ hero, action, phase, ...timing, retried });
      }
    }
    errors.push(...session.errors());
    return { hero, pairs, responses, reopens, errors };
  } finally {
    await session.close();
  }
}
