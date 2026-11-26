import { usesDrill } from "../../drill";
import type { InputAction } from "../../types/input";
import type { TouchButtonAction } from "../../types/touch";

export const buttonAction = (action: TouchButtonAction): InputAction =>
  action === "ultimate" && usesDrill() ? "warp" : action;
