import { BEAT_STEP } from "../../../constants/jory/moves";
import { jory } from "./memory";

/** what one Beat Step costs: Moonwalk's on-beat steps in a row are free */
export const stepCost = (): number => (jory.freeSteps > 0 ? 0 : BEAT_STEP.stamina);
