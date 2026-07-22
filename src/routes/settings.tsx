import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings – AI Workplace" },
      { name: "description", content: "Personalize your AI Workplace experience." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Manage your AI Workplace preferences." },
    ],
  }),
});

function SettingsPage() {
  return (
    <AppLayout greeting="Preferences">
      <PageHeader title="Settings" subtitle="Personalize your AI Workplace experience." />
      <div className="grid md:grid-cols-2 gap-5">
        {[
          { t: "Profile", d: "Manage your name, avatar, and role." },
          { t: "Notifications", d: "Choose what updates you want to receive." },
          { t: "AI defaults", d: "Preferred tone, verbosity, and language." },
          { t: "Privacy", d: "Control how your data is stored." },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] p-6">
            <h3 className="font-semibold">{s.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}