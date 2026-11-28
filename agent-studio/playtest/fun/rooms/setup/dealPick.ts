import { SELECTORS } from "../../../constants/game";
import type { Session } from "../../../types/session";
import type { PickCard } from "../../../types/snapshot";
import { DEALT_KEY, ROOM_MODULES } from "../constants";
import type {
  BoonsModule,
  BuildStatsModule,
  CardFaceModule,
  CardsModule,
  CardViewModule,
  PickCardModule,
  StateModule,
} from "../pageModules";

export function dealPick(session: Session): Promise<PickCard[]> {
  return session.evaluate(
    async ({ modules, selectors, key }) => {
      const [state, cards, { cardView }, { BOONS }, { cardFace }, { pickCard }, { currentBuildStats }] =
        (await Promise.all([
          import(modules.state),
          import(modules.cards),
          import(modules.cardView),
          import(modules.boons),
          import(modules.cardFace),
          import(modules.pickCard),
          import(modules.buildStats),
        ])) as [
          StateModule,
          CardsModule,
          CardViewModule,
          BoonsModule,
          CardFaceModule,
          PickCardModule,
          BuildStatsModule,
        ];
      if (state.progress.picks <= 0) {
        return [];
      }
      const count = cards.cardCount(currentBuildStats().luck, state.rng);
      const dealt = cards.dealCards(state.character, cardView(), state.rng, count, BOONS, []);
      (globalThis as unknown as Record<string, unknown[]>)[key] = dealt;
      return dealt.map((card, index) => {
        const element = pickCard(cardFace(state.character, card, state.progress.build), index);
        return {
          index,
          kind: element.dataset.kind ?? element.dataset.branch ?? "",
          branch: element.dataset.branch ?? "",
          name: element.querySelector(selectors.pickName)?.textContent ?? "",
          level: element.querySelectorAll(selectors.pickLevelPips).length,
          selected: index === 0,
        };
      });
    },
    { modules: ROOM_MODULES, selectors: SELECTORS, key: DEALT_KEY },
  );
}
