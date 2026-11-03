import { AgentMarkdown } from './AgentMarkdown';

/** One reply from the agent, as Markdown. */
export function AgentAssistantText({ text }: { text: string }) {
  return <AgentMarkdown text={text} />;
}
