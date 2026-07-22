import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiWorkspace, Field, textareaCls, parseSections, SectionCards } from "@/components/AiWorkspace";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer – AI Workplace" },
      { name: "description", content: "Turn raw meeting notes into summaries, decisions, action items, and next steps." },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "AI-powered summaries for every meeting." },
    ],
  }),
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  return (
    <AppLayout greeting="Clarity, fast">
      <PageHeader title="Meeting Notes Summarizer" subtitle="Paste your notes and let AI extract what matters." />
      <AiWorkspace
        mode="notes"
        payload={{ notes }}
        canGenerate={notes.trim().length > 20}
        generateLabel="Summarize"
        onClear={() => setNotes("")}
        inputSlot={
          <Field label="Meeting notes">
            <textarea
              className={textareaCls + " min-h-80"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your raw meeting notes, transcript, or bullet points here..."
            />
          </Field>
        }
        renderOutput={(text) => <SectionCards sections={parseSections(text)} />}
      />
    </AppLayout>
  );
}