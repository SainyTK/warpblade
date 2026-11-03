import type { ApprovalItem } from '@shared/api';
import { AgentApprovalResolved } from './AgentApprovalResolved';
import { AgentPlanApproval } from './AgentPlanApproval';
import { AgentQuestionApproval } from './AgentQuestionApproval';
import { AgentToolApproval } from './AgentToolApproval';

/** A permission request from the agent. Pending ones ask; answered ones stay as one line. */
export function AgentApproval({ item }: { item: ApprovalItem }) {
  if (item.status !== 'pending') {
    return <AgentApprovalResolved item={item} />;
  }
  if (item.plan !== null) {
    return <AgentPlanApproval item={item} plan={item.plan} />;
  }
  if (item.questions) {
    return <AgentQuestionApproval item={item} questions={item.questions} />;
  }
  return <AgentToolApproval item={item} />;
}
