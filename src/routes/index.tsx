import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, TrendingUp, ArrowRight, Sparkles, Clock } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { cn } from "@/lib/utils";

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dashboard – AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered workspace for emails, meeting notes, and task planning." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Generate emails, summarize meetings, and plan tasks with AI." },
    ],
  }),
});

const STATS = [
  { label: "Emails Generated", value: 128, delta: "+12 today", icon: Mail },
  { label: "Notes Summarized", value: 42, delta: "+3 today", icon: FileText },
  { label: "Tasks Planned", value: 87, delta: "+9 today", icon: ListChecks },
  { label: "Productivity Score", value: "92%", delta: "+4% this week", icon: TrendingUp },
];

const FEATURES = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    desc: "Draft polished, on-tone emails in seconds. Choose recipient, purpose, and tone.",
    icon: Mail,
  },
  {
    to: "/notes" as const,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into executive summaries, decisions, action items, and next steps.",
    icon: FileText,
  },
  {
    to: "/tasks" as const,
    title: "AI Task Planner",
    desc: "Prioritize your day with high, medium, and low priority tasks and a smart schedule.",
    icon: ListChecks,
  },
];

function Index() {
  return (
    <AppLayout greeting={`${greet()}!`}>
      <PageHeader
        title={`${greet()}! Welcome to your AI Workplace.`}
        subtitle="Your AI assistant is ready to help you be more productive today."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl bg-card border border-border p-5 shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-[var(--shadow-brand)]"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-emerald-600">{s.delta}</span>
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Tools</h2>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-secondary" /> Powered by OpenAI
        </span>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.to}
              to={f.to}
              className={cn(
                "group rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)]",
                "hover:-translate-y-1 hover:shadow-lg transition-all",
              )}
            >
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-[var(--shadow-brand)]"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-secondary group-hover:gap-2.5 transition-all">
                Open tool <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="mt-10 rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-secondary" />
          <h3 className="font-semibold">Recent activity</h3>
        </div>
        <ul className="divide-y divide-border">
          {[
            { t: "Email generated", d: "Request for project approval", ago: "2 mins ago" },
            { t: "Notes summarized", d: "Team standup – 24 May", ago: "15 mins ago" },
            { t: "Task plan created", d: "Weekly plan – 26 May", ago: "45 mins ago" },
            { t: "Research completed", d: "AI in Project Management", ago: "1 hr ago" },
          ].map((r, i) => (
            <li key={i} className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{r.t}</div>
                <div className="text-muted-foreground">{r.d}</div>
              </div>
              <span className="text-xs text-muted-foreground">{r.ago}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
