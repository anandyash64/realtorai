import { workflow } from "@/lib/data";

export function WorkflowVisual() {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
      <div className="grid gap-3">
        {workflow.map((item, index) => (
          <div key={item} className="grid gap-3">
            <div className="flex items-center gap-3 rounded-md border border-line bg-cloud p-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-blue-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{item}</div>
                <div className="text-xs text-muted">
                  {index === 0 && "New inquiry captured"}
                  {index === 1 && "Voice agent starts outreach"}
                  {index === 2 && "Intent and readiness scored"}
                  {index === 3 && "Calendly slot confirmed"}
                  {index === 4 && "Summary sent to dashboard"}
                </div>
              </div>
            </div>
            {index < workflow.length - 1 ? (
              <div className="ml-4 h-5 w-px bg-line" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
