import { STAGES } from "../../stages";
import type { StageId } from "../../types/campaign";

export const stageAccent = (id: StageId): string => `#${STAGES[id].mini.light.toString(16).padStart(6, "0")}`;
