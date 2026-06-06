import { SectionShell } from "../SectionShell";
import { BudgetSlider } from "../interactive/BudgetSlider";
import { FakeGitHubSettings } from "../interactive/FakeGitHubSettings";

export function AdminSection() {
  return (
    <SectionShell
      id="admin"
      eyebrow="08 · The control panel"
      title={<>Set the <span className="gradient-text">policy</span> &amp; enterprise limit</>}
      compact
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <FakeGitHubSettings />
        <BudgetSlider />
      </div>
    </SectionShell>
  );
}
