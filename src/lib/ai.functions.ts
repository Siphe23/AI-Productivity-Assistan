import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  mode: z.enum(["email", "notes", "tasks"]),
  payload: z.record(z.string(), z.string()).default({}),
});

const PROMPTS: Record<string, (p: Record<string, string>) => { system: string; user: string }> = {
  email: (p) => ({
    system:
      "You are an expert business email writer. Write a complete, polished email ready to send. Return only the email body with subject line and greeting/signoff. No commentary.",
    user: `Write a professional email.\n\nRecipient: ${p.recipient || "(unspecified)"}\nSubject: ${p.subject || "(let me choose)"}\nPurpose: ${p.purpose || "(unspecified)"}\nTone: ${p.tone || "Professional"}\nAdditional instructions: ${p.instructions || "None"}`,
  }),
  notes: (p) => ({
    system:
      "You are an expert meeting notes analyst. Given raw meeting notes, output clean Markdown with exactly these H2 sections in order: Executive Summary, Key Decisions, Action Items, Deadlines, Next Steps. Use concise bullet points.",
    user: `Meeting notes:\n\n${p.notes || ""}`,
  }),
  tasks: (p) => ({
    system:
      "You are an expert productivity coach. Given the user's tasks and priorities, output clean Markdown with exactly these H2 sections in order: High Priority Tasks, Medium Priority Tasks, Low Priority Tasks, Suggested Daily Schedule, Productivity Tips. Use bullets and time blocks.",
    user: `Tasks and priorities for today:\n\n${p.tasks || ""}`,
  }),
};

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    const { system, user } = PROMPTS[data.mode](data.payload);
    try {
      const { text } = await generateText({
        model: gateway("openai/gpt-5.5"),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });
      return { text };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      if (msg.includes("429")) throw new Error("Rate limit reached. Please wait a moment and try again.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Please add credits to continue.");
      throw new Error(msg);
    }
  });