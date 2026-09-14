'use client';

import type { DevScenario, DevScenarioPlan } from '@/lib/dev-scenarios';

interface Props {
  plans: Record<DevScenario, DevScenarioPlan>;
  onApply: (scenario: DevScenario) => void;
}

const SCENARIOS: Array<{ key: DevScenario; label: string }> = [
  { key: 'all-correct', label: 'Fill all correct' },
  { key: 'pass-with-incorrect', label: 'Fill pass with some incorrect' },
  { key: 'fail', label: 'Fill fail' },
];

export default function DevScenarioPanel({ plans, onApply }: Props) {
  return (
    <aside className="mb-8 border-l-4 border-accent bg-secondary px-5 py-5" aria-label="Development scenario controls">
      <p className="eyebrow mb-2">Development tools</p>
      <h2 className="mb-2 text-2xl">Fill an assessment scenario</h2>
      <p className="mb-4 max-w-2xl text-sm leading-6 text-muted-foreground">Apply a complete answer set without changing the timer or leaving this practice page.</p>
      <div className="flex flex-wrap gap-3">
        {SCENARIOS.map(({ key, label }) => (
          <div key={key} className="min-w-0">
            <button className="btn btn-secondary" type="button" disabled={Boolean(plans[key].disabledReason)} onClick={() => onApply(key)}>
              {label}
            </button>
            {plans[key].disabledReason && <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">{plans[key].disabledReason}</p>}
          </div>
        ))}
      </div>
    </aside>
  );
}
