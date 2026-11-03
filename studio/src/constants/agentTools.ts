import {
  Bot,
  FilePen,
  FileText,
  Globe,
  ListTodo,
  type LucideIcon,
  Search,
  SquareTerminal,
  Wrench,
} from 'lucide-react';

/** The icon each Claude Code tool shows in the timeline. Unlisted tools use a wrench. */
export const TOOL_ICONS: Record<string, LucideIcon> = {
  Bash: SquareTerminal,
  Read: FileText,
  Write: FilePen,
  Edit: FilePen,
  MultiEdit: FilePen,
  NotebookEdit: FilePen,
  Grep: Search,
  Glob: Search,
  WebFetch: Globe,
  WebSearch: Globe,
  TodoWrite: ListTodo,
  Task: Bot,
  Agent: Bot,
};

export const DEFAULT_TOOL_ICON = Wrench;
