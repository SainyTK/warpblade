import Markdown, { type Components, defaultUrlTransform, type UrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextLink } from '@/components/common/TextLink';
import { codeLanguage, hastText } from '@/utils/hastText';
import { AgentCodeBlock } from './AgentCodeBlock';
import { AgentImage } from './AgentImage';

/** Image sources stay as written. Links keep the safe default. */
const urlTransform: UrlTransform = (url, key, node) =>
  key === 'src' && node.tagName === 'img' ? url : defaultUrlTransform(url);

/** Raw HTML in a reply is never rendered: react-markdown leaves it out without a raw-HTML plugin. */
const COMPONENTS: Components = {
  a: ({ node: _, ...props }) => <TextLink {...props} external />,
  pre: ({ node }) => {
    const code = node?.children[0];
    return (
      <AgentCodeBlock code={hastText(code).replace(/\n$/, '')} language={codeLanguage(code)} />
    );
  },
  // Only inline code reaches here: fenced blocks render through `pre`.
  code: ({ node: _, ...props }) => (
    <code {...props} className="rounded-[4px] bg-muted px-[5px] py-px font-mono text-[0.875em]" />
  ),
  img: ({ src, alt }) =>
    typeof src === 'string' && /^(https:|data:image\/|\/api\/)/.test(src) ? (
      <AgentImage image={{ src, alt: alt ?? '' }} variant="inline" />
    ) : null,
  table: ({ node: _, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

/** The agent's reply as GitHub-flavored Markdown: lists, tables, task lists and code blocks with Copy. */
export function AgentMarkdown({ text }: { text: string }) {
  return (
    <div className="agent-markdown" dir="auto">
      <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS} urlTransform={urlTransform}>
        {text}
      </Markdown>
    </div>
  );
}
