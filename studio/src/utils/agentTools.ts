// How a tool call reads in the timeline: a short summary of what it did and its input as text.

function field(input: unknown, name: string): string {
  if (typeof input !== 'object' || input === null) {
    return '';
  }
  const value = (input as Record<string, unknown>)[name];
  return typeof value === 'string' ? value : '';
}

function fileName(path: string) {
  return path.split('/').filter(Boolean).at(-1) ?? path;
}

/** One line naming what the call works on: the command, file, pattern or address. */
export function toolSummary(name: string, input: unknown): string {
  switch (name) {
    case 'Bash':
      return field(input, 'description') || field(input, 'command');
    case 'Read':
    case 'Write':
    case 'Edit':
    case 'MultiEdit':
    case 'NotebookEdit':
      return fileName(field(input, 'file_path') || field(input, 'notebook_path'));
    case 'Grep':
    case 'Glob':
      return field(input, 'pattern');
    case 'WebFetch':
      return field(input, 'url');
    case 'WebSearch':
      return field(input, 'query');
    case 'Task':
    case 'Agent':
      return field(input, 'description');
    case 'Skill':
      return field(input, 'skill');
    default:
      return '';
  }
}

/** The input shown when a call is opened: the command itself for Bash, the edit for Edit, JSON otherwise. */
export function toolInputText(name: string, input: unknown): string {
  if (name === 'Bash' && field(input, 'command')) {
    return field(input, 'command');
  }
  if (name === 'Edit' && field(input, 'file_path')) {
    const before = field(input, 'old_string');
    const after = field(input, 'new_string');
    return `${field(input, 'file_path')}\n\n- ${before.split('\n').join('\n- ')}\n+ ${after.split('\n').join('\n+ ')}`;
  }
  if (name === 'Write' && field(input, 'file_path')) {
    return `${field(input, 'file_path')}\n\n${field(input, 'content')}`;
  }
  return JSON.stringify(input, null, 2);
}
