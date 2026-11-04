import { FeedbackApiError, voteFeedback } from "../../services/feedbackApi";
import { forgetVote, hasVoted, rememberVote } from "../../services/feedbackVotes";
import type { Feedback } from "../../types/feedback";
import { el } from "../dom";

/** The +1 button and the vote count. The count goes up at once; when the API refuses, it goes back down and says
    why next to the button. One vote per item from this browser. */
export function voteButton(item: Feedback): HTMLElement {
  const box = el("div", "vote");
  const button = el("button", "button vote-button", "+1");
  button.type = "button";
  const count = el("span", "vote-count");
  const error = el("p", "vote-error");
  error.setAttribute("role", "status");
  let votes = item.votes;

  const render = (voted: boolean): void => {
    count.textContent = `${votes} ${votes === 1 ? "vote" : "votes"}`;
    button.disabled = voted;
    button.setAttribute("aria-pressed", String(voted));
    button.setAttribute("aria-label", voted ? `Voted for #${item.id}` : `Vote for #${item.id}`);
  };
  render(hasVoted(item.id));

  button.addEventListener("click", async () => {
    error.textContent = "";
    votes += 1;
    rememberVote(item.id);
    render(true);
    box.dataset.pending = "";
    try {
      votes = await voteFeedback(item.id);
      render(true);
    } catch (failure) {
      votes -= 1;
      forgetVote(item.id);
      render(false);
      const reason = failure instanceof FeedbackApiError ? failure.message : "Something went wrong.";
      error.textContent = `Vote not counted. ${reason}`;
    } finally {
      delete box.dataset.pending;
    }
  });

  box.append(button, count, error);
  return box;
}
