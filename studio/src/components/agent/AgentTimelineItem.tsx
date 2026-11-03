import type { TimelineItem } from '@shared/api';
import { AgentApproval } from './AgentApproval';
import { AgentAssistantText } from './AgentAssistantText';
import { AgentNotice } from './AgentNotice';
import { AgentThinking } from './AgentThinking';
import { AgentToolCall } from './AgentToolCall';
import { AgentUserMessage } from './AgentUserMessage';

export function AgentTimelineItem({ item, live }: { item: TimelineItem; live: boolean }) {
  switch (item.kind) {
    case 'user':
      return <AgentUserMessage item={item} />;
    case 'text':
      return <AgentAssistantText text={item.text} />;
    case 'thinking':
      return <AgentThinking item={item} live={live} />;
    case 'tool':
      return <AgentToolCall item={item} />;
    case 'approval':
      return <AgentApproval item={item} />;
    case 'notice':
      return <AgentNotice item={item} />;
  }
}
