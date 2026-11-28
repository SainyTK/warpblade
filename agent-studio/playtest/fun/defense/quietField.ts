import type { Session } from "../../types/session";
import { DEFENSE_MODULES } from "./constants";
import type { DefenseModule, StateModule } from "./pageModules";

export function quietField(session: Session): Promise<void> {
  return session.evaluate(
    async ({ modules }) => {
      const [{ game }, { defense }] = (await Promise.all([import(modules.state), import(modules.defense)])) as [
        StateModule,
        DefenseModule,
      ];
      if (!defense) {
        throw new Error("The run is not a crystal defense.");
      }
      defense.packIn = Number.POSITIVE_INFINITY;
      defense.bigFoeCall = Number.MAX_SAFE_INTEGER;
      game.enemies = [];
      game.fx = game.fx.filter((effect) => !effect.rift);
    },
    { modules: DEFENSE_MODULES },
  );
}
