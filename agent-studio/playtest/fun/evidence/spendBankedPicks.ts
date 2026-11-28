import { skilledPolicy } from "../../bots/skilled";
import type { Session } from "../../types/session";
import { BOT_TICK_MS, PAGE_MODULES, PICK_LIMIT } from "./constants";
import type { GameStateModule, ProgressModule } from "./types";

export interface Shards {
  hearts: number;
  manas: number;
}

export async function spendBankedPicks(session: Session, shards: Shards): Promise<number> {
  await session.page.evaluate(
    async ({ modules, shards }) => {
      const [{ progress }, growth] = (await Promise.all([import(modules.state), import(modules.progress)])) as [
        GameStateModule,
        ProgressModule,
      ];
      progress.heartShards = shards.hearts;
      progress.manaShards = shards.manas;
      growth.refreshGrowing();
      growth.openPicks();
    },
    { modules: PAGE_MODULES, shards },
  );
  let taken = 0;
  for (let i = 0; i < PICK_LIMIT; i++) {
    const state = await session.state();
    if (state.pick.length === 0) {
      if (state.mode !== "pick") {
        break;
      }
      await session.advance(BOT_TICK_MS);
      continue;
    }
    await session.choosePick(skilledPolicy.choosePick(state.pick));
    taken++;
  }
  return taken;
}
