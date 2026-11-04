import "./feedback.css";
import { el } from "../dom";
import { mountPage } from "../shell/pageShell";
import { feedbackBoard } from "./feedbackBoard";
import { feedbackForm } from "./feedbackForm";
import { ownFeedbackList } from "./ownFeedbackList";

const HIGHLIGHT = "is-highlighted";

function start(): void {
  const main = mountPage("feedback");
  const own = ownFeedbackList();
  const board = feedbackBoard(() => revealFromHash());
  const side = el("div", "feedback-side");
  side.append(
    feedbackForm((item) => own.add(item)),
    own.element,
  );
  const layout = el("div", "feedback-layout");
  layout.append(side, board.element);
  main.append(layout);

  /** #12 in the address scrolls to that card and marks it */
  function revealFromHash(): void {
    const id = Number(window.location.hash.slice(1));
    for (const marked of document.querySelectorAll(`.${HIGHLIGHT}`)) marked.classList.remove(HIGHLIGHT);
    if (!Number.isInteger(id) || id <= 0) return;
    const card = board.reveal(id) ?? own.find(id);
    if (!card) return;
    card.classList.add(HIGHLIGHT);
    card.scrollIntoView({ block: "center" });
    card.focus({ preventScroll: true });
  }

  void own.load().then(revealFromHash);
  void board.load();
  window.addEventListener("hashchange", revealFromHash);
}

start();
