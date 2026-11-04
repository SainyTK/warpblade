import { FEEDBACK_LIMITS } from "../../constants/feedback";
import { GAME_VERSION } from "../../constants/sitePages";
import { FeedbackApiError, sendFeedback } from "../../services/feedbackApi";
import { addOwnFeedbackId } from "../../services/ownFeedback";
import type { Feedback } from "../../types/feedback";
import { el } from "../dom";
import { categoryChoice } from "./categoryChoice";

function fieldError(id: string): HTMLParagraphElement {
  const error = el("p", "field-error");
  error.id = id;
  return error;
}

/** a field off-screen that people never see or fill; bots that fill every field get dropped by the API */
function honeypot(): { element: HTMLElement; input: HTMLInputElement } {
  const element = el("div", "honeypot");
  element.setAttribute("aria-hidden", "true");
  const label = el("label", undefined, "Website");
  const input = el("input");
  input.type = "text";
  input.name = "website";
  input.tabIndex = -1;
  input.autocomplete = "off";
  label.append(input);
  element.append(label);
  return { element, input };
}

/** Send feedback: category, message with a live count, an optional name, and Send. A sent item goes to onSent. */
export function feedbackForm(onSent: (item: Feedback) => void): HTMLElement {
  const form = el("form", "feedback-form panel");
  form.noValidate = true;
  form.setAttribute("aria-labelledby", "form-title");
  const title = el("h2", "section-title", "Send feedback");
  title.id = "form-title";

  const categoryError = fieldError("category-error");
  const category = categoryChoice("category", categoryError.id);

  const messageLabel = el("label", "field-label", "Message");
  messageLabel.htmlFor = "message";
  const message = el("textarea", "input textarea");
  message.id = "message";
  message.name = "message";
  message.rows = 6;
  message.maxLength = FEEDBACK_LIMITS.messageMax;
  const messageError = fieldError("message-error");
  const count = el("p", "char-count");
  count.id = "message-count";
  message.setAttribute("aria-describedby", `${messageError.id} ${count.id}`);
  const messageFoot = el("div", "field-foot");
  messageFoot.append(messageError, count);

  const nameLabel = el("label", "field-label", "Name");
  nameLabel.htmlFor = "name";
  nameLabel.append(el("span", "field-optional", "optional"));
  const name = el("input", "input");
  name.id = "name";
  name.name = "name";
  name.maxLength = FEEDBACK_LIMITS.nameMax;
  name.setAttribute("autocomplete", "nickname");

  const trap = honeypot();
  const send = el("button", "button button-primary", "Send");
  send.type = "submit";
  const status = el("p", "form-status");
  status.setAttribute("role", "status");
  const actions = el("div", "form-actions");
  actions.append(send, status);

  const field = (...children: HTMLElement[]): HTMLElement => {
    const box = el("div", "field");
    box.append(...children);
    return box;
  };
  form.append(
    title,
    field(category.element, categoryError),
    field(messageLabel, message, messageFoot),
    field(nameLabel, name),
    trap.element,
    actions,
  );

  const updateCount = (): void => {
    count.textContent = `${message.value.length}/${FEEDBACK_LIMITS.messageMax}`;
  };
  updateCount();
  message.addEventListener("input", () => {
    updateCount();
    messageError.textContent = "";
    message.removeAttribute("aria-invalid");
  });
  category.element.addEventListener("change", () => {
    categoryError.textContent = "";
  });

  const showStatus = (text: string, failed: boolean): void => {
    status.textContent = text;
    status.toggleAttribute("data-error", failed);
  };

  /** the first invalid field gets the focus; true when everything is fine */
  const validate = (): boolean => {
    let valid = true;
    if (!category.value()) {
      categoryError.textContent = "Pick a category.";
      category.focus();
      valid = false;
    }
    if (message.value.trim().length < FEEDBACK_LIMITS.messageMin) {
      messageError.textContent = `Write at least ${FEEDBACK_LIMITS.messageMin} characters.`;
      message.setAttribute("aria-invalid", "true");
      if (valid) message.focus();
      valid = false;
    }
    return valid;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showStatus("", false);
    const chosen = category.value();
    if (!validate() || !chosen) return;
    send.disabled = true;
    send.textContent = "Sending";
    try {
      const item = await sendFeedback({
        category: chosen,
        message: message.value.trim(),
        name: name.value.trim() || undefined,
        gameVersion: GAME_VERSION,
        website: trap.input.value,
      });
      addOwnFeedbackId(item.id);
      onSent(item);
      form.reset();
      category.clear();
      updateCount();
      showStatus(`Sent as #${item.id}. The studio reads new feedback every night.`, false);
    } catch (failure) {
      showStatus(failure instanceof FeedbackApiError ? failure.message : "Something went wrong. Try again.", true);
    } finally {
      send.disabled = false;
      send.textContent = "Send";
    }
  });

  return form;
}
