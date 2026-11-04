import { FEEDBACK_CATEGORIES } from "../../constants/feedback";
import { FEEDBACK_CATEGORY_LABELS } from "../../constants/feedbackLabels";
import type { FeedbackCategory } from "../../types/feedback";
import { el } from "../dom";

export interface CategoryChoice {
  element: HTMLFieldSetElement;
  value(): FeedbackCategory | null;
  clear(): void;
  focus(): void;
}

/** Bug, Balance, Idea or Other as one segmented control of radio buttons */
export function categoryChoice(name: string, describedBy: string): CategoryChoice {
  const element = el("fieldset", "segmented-field");
  element.setAttribute("aria-describedby", describedBy);
  const legend = el("legend", "field-label", "Category");
  const group = el("div", "segmented");
  const inputs = FEEDBACK_CATEGORIES.map((category) => {
    const option = el("label", "segment");
    const input = el("input");
    input.type = "radio";
    input.name = name;
    input.value = category;
    option.append(input, el("span", undefined, FEEDBACK_CATEGORY_LABELS[category]));
    group.append(option);
    return { category, input };
  });
  element.append(legend, group);
  return {
    element,
    value: () => inputs.find(({ input }) => input.checked)?.category ?? null,
    clear() {
      for (const { input } of inputs) input.checked = false;
    },
    focus() {
      inputs[0]?.input.focus();
    },
  };
}
