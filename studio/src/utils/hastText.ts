import type { ElementContent, Nodes } from 'hast';

/** The plain text of a rendered Markdown node, such as a code block's code. */
export function hastText(node: Nodes | ElementContent | undefined): string {
  if (!node) {
    return '';
  }
  if (node.type === 'text') {
    return node.value;
  }
  return 'children' in node
    ? node.children.map((child) => hastText(child as ElementContent)).join('')
    : '';
}

/** The language of a fenced code block, from its `language-*` class. */
export function codeLanguage(node: ElementContent | undefined): string {
  if (node?.type !== 'element') {
    return '';
  }
  const classes = node.properties.className;
  const names = Array.isArray(classes) ? classes.map(String) : [];
  return names.find((name) => name.startsWith('language-'))?.slice('language-'.length) ?? '';
}
