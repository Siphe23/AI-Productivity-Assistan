import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  History,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes Summarizer", icon: FileText },
  { to: "/tasks", label: "AI Task Planner", icon: ListChecks },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppLayout({ children, greeting }: { children: ReactNode; greeting?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => setOpen(false), [path]);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary shadow-[var(--shadow-brand)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight">AI Workplace</div>
            <div className="text-xs text-sidebar-foreground/60">Productivity Assistant</div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "text-white shadow-[var(--shadow-brand)]"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-white",
                )}
                style={active ? { backgroundImage: "var(--gradient-sidebar-active)" } : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl bg-sidebar-accent/60 backdrop-blur p-4 border border-sidebar-border">
            <div className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-1">
              Responsible AI
            </div>
            <p className="text-xs text-sidebar-foreground/80 leading-relaxed">
              Always review AI outputs before using them.
            </p>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-3 px-4 md:px-8 h-16">
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search anything..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-secondary focus:bg-background focus:outline-none text-sm transition-colors"
              />
            </div>
            <button
              onClick={() => setDark((v) => !v)}
              className="h-10 w-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative h-10 w-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-secondary" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-3 pr-1">
              <div className="text-right leading-tight">
                <div className="text-sm font-medium">{greeting ?? "Hi there"}</div>
                <div className="text-xs text-muted-foreground">Productive today ✨</div>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ backgroundImage: "var(--gradient-brand)" }}>
                AI
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-10">{children}</main>

        <footer className="px-4 md:px-8 pb-8">
          <div className="rounded-2xl border border-border bg-accent/60 p-4 text-xs text-accent-foreground/80 leading-relaxed">
            <span className="font-semibold text-accent-foreground">Responsible AI Notice:</span>{" "}
            AI-generated content may contain inaccuracies. Always review and verify outputs before using them in professional or business environments. Do not enter confidential or sensitive information.
          </div>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function BrandButton({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 h-11 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" && "text-white shadow-[var(--shadow-brand)] hover:brightness-110 active:brightness-95",
        variant === "outline" && "border border-border bg-card hover:bg-muted text-foreground",
        variant === "ghost" && "hover:bg-muted text-foreground",
        className,
      )}
      style={variant === "primary" ? { backgroundImage: "var(--gradient-brand)" } : undefined}
    >
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin",
        className,
      )}
    />
  );
}