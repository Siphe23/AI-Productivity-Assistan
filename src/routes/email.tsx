import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiWorkspace, Field, inputCls, textareaCls } from "@/components/AiWorkspace";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [
      { title: "Smart Email Generator – AI Workplace" },
      { name: "description", content: "Generate professional emails with the right tone in seconds using AI." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "AI-drafted business emails, ready to send." },
    ],
  }),
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [instructions, setInstructions] = useState("");

  return (
    <AppLayout greeting="Compose smarter">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Draft polished, on-tone business emails in seconds."
      />
      <AiWorkspace
        mode="email"
        payload={{ recipient, subject, purpose, tone, instructions }}
        canGenerate={purpose.trim().length > 0}
        generateLabel="Generate Email"
        onClear={() => {
          setRecipient("");
          setSubject("");
          setPurpose("");
          setTone("Professional");
          setInstructions("");
        }}
        inputSlot={
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Recipient">
                <input className={inputCls} value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Alex Morgan" />
              </Field>
              <Field label="Subject">
                <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Project update" />
              </Field>
            </div>
            <Field label="Purpose">
              <textarea className={textareaCls} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is this email about?" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tone">
                <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value)}>
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Persuasive</option>
                </select>
              </Field>
              <Field label="Additional instructions">
                <input className={inputCls} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Optional context" />
              </Field>
            </div>
          </>
        }
      />
    </AppLayout>
  );
}