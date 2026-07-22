import { useState, type ReactNode } from "react";
import { Copy, RefreshCw, Trash2, Sparkles, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { generateAi } from "@/lib/ai.functions";
import { BrandButton, Spinner } from "./AppLayout";
import { cn } from "@/lib/utils";

type Mode = "email" | "notes" | "tasks";

export function AiWorkspace({
  mode,
  payload,
  inputSlot,
  renderOutput,
  generateLabel = "Generate",
  onClear,
  canGenerate,
}: {
  mode: Mode;
  payload: Record<string, string>;
  inputSlot: ReactNode;
  renderOutput?: (text: string, setText: (v: string) => void) => ReactNode;
  generateLabel?: string;
  onClear: () => void;
  canGenerate: boolean;
}) {
  const run = useServerFn(generateAi);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setErr(null);
    try {
      const res = await run({ data: { mode, payload } });
      setText(res.text);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function clear() {
    setText("");
    setErr(null);
    onClear();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] p-6">
        <h2 className="text-lg font-semibold mb-4">Inputs</h2>
        <div className="space-y-4">{inputSlot}</div>
        <div className="flex flex-wrap gap-3 mt-6">
          <BrandButton onClick={generate} disabled={!canGenerate || loading}>
            {loading ? <Spinner /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : generateLabel}
          </BrandButton>
          <BrandButton variant="outline" onClick={generate} disabled={!text || loading}>
            <RefreshCw className="h-4 w-4" /> Regenerate
          </BrandButton>
          <BrandButton variant="ghost" onClick={clear} disabled={loading}>
            <Trash2 className="h-4 w-4" /> Clear
          </BrandButton>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] p-6 min-h-[420px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Result</h2>
          <BrandButton variant="outline" onClick={copy} disabled={!text} className="h-9 px-3 text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </BrandButton>
        </div>
        {err && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 text-sm mb-4">
            {err}
          </div>
        )}
        {loading && !text ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm gap-2">
            <Spinner className="text-secondary" /> Working with AI...
          </div>
        ) : text ? (
          renderOutput ? (
            renderOutput(text, setText)
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-relaxed focus:outline-none focus:border-secondary"
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground px-4">
            <div>
              <div className="mx-auto h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              Your AI-generated result will appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-secondary transition-colors";
export const textareaCls =
  "w-full min-h-32 p-4 rounded-xl border border-border bg-background text-sm leading-relaxed focus:outline-none focus:border-secondary transition-colors resize-y";

export function parseSections(md: string): { title: string; items: string[] }[] {
  const lines = md.split("\n");
  const sections: { title: string; items: string[] }[] = [];
  let current: { title: string; items: string[] } | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^#{1,3}\s+(.+)$/);
    if (h) {
      if (current) sections.push(current);
      current = { title: h[1].replace(/[*_]/g, "").trim(), items: [] };
      continue;
    }
    if (!current) continue;
    if (line.startsWith("- ") || line.startsWith("* ") || /^\d+\.\s/.test(line)) {
      current.items.push(line.replace(/^[-*]\s+|^\d+\.\s+/, "").trim());
    } else if (line) {
      current.items.push(line);
    }
  }
  if (current) sections.push(current);
  return sections.filter((s) => s.items.length > 0);
}

export function SectionCards({
  sections,
  tone = "default",
}: {
  sections: { title: string; items: string[] }[];
  tone?: "default" | "priority";
}) {
  const priorityColor = (t: string) => {
    const s = t.toLowerCase();
    if (s.includes("high")) return "bg-destructive/10 text-destructive border-destructive/20";
    if (s.includes("medium")) return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    if (s.includes("low")) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    return "bg-secondary/10 text-secondary border-secondary/20";
  };
  return (
    <div className="space-y-4 flex-1 overflow-y-auto">
      {sections.map((s, i) => (
        <div key={i} className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
                tone === "priority"
                  ? priorityColor(s.title)
                  : "bg-secondary/10 text-secondary border-secondary/20",
              )}
            >
              {s.title}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-foreground/90">
            {s.items.map((it, j) => (
              <li key={j} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span className="leading-relaxed">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}