import type { PermissionResult, PermissionUpdate } from '@anthropic-ai/claude-agent-sdk';
import type { ApprovalDecision, Question } from '../../shared/api';
import type { PermissionModeId } from '../../shared/permissionModes';

export const PLAN_TOOL = 'ExitPlanMode';
export const QUESTION_TOOL = 'AskUserQuestion';

/** The mode a plan approval switches to: Approve keeps asking before edits, Always accepts them. */
export function modeAfterPlan(decision: ApprovalDecision): PermissionModeId | null {
  if (decision === 'allow') {
    return 'default';
  }
  return decision === 'always' ? 'acceptEdits' : null;
}

export function planText(toolName: string, input: Record<string, unknown>): string | null {
  return toolName === PLAN_TOOL && typeof input.plan === 'string' ? input.plan : null;
}

export function questions(toolName: string, input: Record<string, unknown>): Question[] | null {
  if (toolName !== QUESTION_TOOL || !Array.isArray(input.questions)) {
    return null;
  }
  return input.questions.map((raw: Record<string, unknown>) => ({
    question: String(raw.question ?? ''),
    header: String(raw.header ?? ''),
    multiSelect: raw.multiSelect === true,
    options: Array.isArray(raw.options)
      ? raw.options.map((option: Record<string, unknown>) => ({
          label: String(option.label ?? ''),
          description: String(option.description ?? ''),
        }))
      : [],
  }));
}

/**
 * The Agent SDK answer for the owner's decision.
 * Always allow saves the rules Claude Code suggested, where Claude Code would save them, minus mode changes:
 * the mode picker owns the mode.
 */
export function permissionResult(input: {
  toolName: string;
  toolInput: Record<string, unknown>;
  toolUseId: string;
  decision: ApprovalDecision;
  suggestions: PermissionUpdate[];
  answers: Record<string, string> | null;
}): PermissionResult {
  if (input.decision === 'deny') {
    return {
      behavior: 'deny',
      message:
        input.toolName === PLAN_TOOL
          ? 'The owner wants to keep planning. Ask what to change.'
          : 'The owner denied this tool call.',
      toolUseID: input.toolUseId,
      decisionClassification: 'user_reject',
    };
  }
  const updatedInput =
    input.toolName === QUESTION_TOOL && input.answers
      ? { ...input.toolInput, answers: input.answers }
      : input.toolInput;
  const nextMode = input.toolName === PLAN_TOOL ? modeAfterPlan(input.decision) : null;
  const rules =
    input.decision === 'always' && input.toolName !== PLAN_TOOL
      ? input.suggestions.filter((suggestion) => suggestion.type !== 'setMode')
      : [];
  const updatedPermissions: PermissionUpdate[] = nextMode
    ? [{ type: 'setMode', mode: nextMode, destination: 'session' }]
    : rules.length
      ? rules
      : input.decision === 'always'
        ? [
            {
              type: 'addRules',
              rules: [{ toolName: input.toolName }],
              behavior: 'allow',
              destination: 'session',
            },
          ]
        : [];
  return {
    behavior: 'allow',
    updatedInput,
    toolUseID: input.toolUseId,
    decisionClassification: input.decision === 'always' ? 'user_permanent' : 'user_temporary',
    ...(updatedPermissions.length ? { updatedPermissions } : {}),
  };
}
