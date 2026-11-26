import { drillFighter } from "../../../../drill";
import { shadeAnswering } from "./sagesShade";

export const sagesShadeDrill = shadeAnswering((values) => {
  const h = drillFighter();
  if (h && values["drill.warp"]) {
    h.warpReadyIn = 0;
  }
});
