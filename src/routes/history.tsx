import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Clock, Mail, FileText, ListChecks } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "History – AI Workplace" },
      { name: "description", content: "Review your recent AI-generated emails, summaries, and plans." },
      { property: "og:title", content: "History" },
      { property: "og:description", content: "Your recent AI activity." },
    ],
  }),
});

const ITEMS = [
  { icon: Mail, t: "Email to Alex Morgan", d: "Project kickoff — Professional tone", ago: "2 mins ago" },
  { icon: FileText, t: "Q3 planning meeting", d: "5 action items, 3 decisions", ago: "1 hr ago" },
  { icon: ListChecks, t: "Daily plan", d: "3 high-priority, 4 medium, 2 low", ago: "Yesterday" },
  { icon: Mail, t: "Follow-up to client", d: "Persuasive tone", ago: "2 days ago" },
];

function HistoryPage() {
  return (
    <AppLayout greeting="Your activity">
      <PageHeader title="History" subtitle="A running log of your AI-generated work." />
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-card)]">
        <ul className="divide-y divide-border">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <li key={i} className="flex items-center gap-4 p-5">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-[var(--shadow-brand)] shrink-0"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{it.t}</div>
                  <div className="text-sm text-muted-foreground">{it.d}</div>
                </div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {it.ago}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AppLayout>
  );
}