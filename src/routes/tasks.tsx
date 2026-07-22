import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiWorkspace, Field, textareaCls, parseSections, SectionCards } from "@/components/AiWorkspace";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({
    meta: [
      { title: "AI Task Planner – AI Workplace" },
      { name: "description", content: "Prioritize tasks and get a smart daily schedule with AI." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Plan your day with AI-driven priorities and schedule." },
    ],
  }),
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  return (
    <AppLayout greeting="Plan your day">
      <PageHeader title="AI Task Planner" subtitle="Enter your tasks and priorities — get a focused daily plan." />
      <AiWorkspace
        mode="tasks"
        payload={{ tasks }}
        canGenerate={tasks.trim().length > 5}
        generateLabel="Generate Plan"
        onClear={() => setTasks("")}
        inputSlot={
          <Field label="Today's tasks & priorities">
            <textarea
              className={textareaCls + " min-h-80"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"e.g.\n- Finish Q3 report (urgent)\n- Review team PRs\n- Call client about renewal\n- Gym"}
            />
          </Field>
        }
        renderOutput={(text) => <SectionCards sections={parseSections(text)} tone="priority" />}
      />
    </AppLayout>
  );
}