/** Player feedback lives in GitHub Issues with the game-feedback label, which the issue form applies. */
export const REPO_URL = "https://github.com/SainyTK/warpblade";
export const FEEDBACK_LABEL = "game-feedback";
/** the issue form players fill in (.github/ISSUE_TEMPLATE/game-feedback.yml) */
export const FEEDBACK_FORM_URL = `${REPO_URL}/issues/new?template=game-feedback.yml`;

export const feedbackIssueUrl = (id: number): string => `${REPO_URL}/issues/${id}`;
