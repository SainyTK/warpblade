import type { ApprovalItem, Question } from '@shared/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { AgentApprovalCard } from './AgentApprovalCard';
import { AgentQuestionField } from './AgentQuestionField';

/** The agent's multiple-choice questions. Each answer goes back as the chosen labels, comma-separated. */
export function AgentQuestionApproval({
  item,
  questions,
}: {
  item: ApprovalItem;
  questions: Question[];
}) {
  const { decide } = useActiveJob();
  const [chosen, setChosen] = useState<Record<string, string[]>>({});
  const complete = questions.every((question) => (chosen[question.question] ?? []).length > 0);

  function toggle(question: Question, label: string) {
    setChosen((current) => {
      const picked = current[question.question] ?? [];
      const next = question.multiSelect
        ? picked.includes(label)
          ? picked.filter((value) => value !== label)
          : [...picked, label]
        : [label];
      return { ...current, [question.question]: next };
    });
  }

  function submit() {
    const answers = Object.fromEntries(
      questions.map((question) => [
        question.question,
        (chosen[question.question] ?? []).join(', '),
      ]),
    );
    void decide(item.id, 'allow', answers);
  }

  return (
    <AgentApprovalCard
      title={questions.length === 1 ? 'The agent has a question' : 'The agent has some questions'}
      description={null}
      actions={
        <>
          <Button onClick={submit} disabled={!complete}>
            Send answers
          </Button>
          <Button variant="ghost" onClick={() => decide(item.id, 'deny')}>
            Skip
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        {questions.map((question) => (
          <AgentQuestionField
            key={question.question}
            question={question}
            picked={chosen[question.question] ?? []}
            onToggle={(label) => toggle(question, label)}
          />
        ))}
      </div>
    </AgentApprovalCard>
  );
}
