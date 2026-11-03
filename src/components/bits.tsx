import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Info, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LICENSE_SHORT, STAGES, STAGE_LABELS_SHORT, type LicenseType, type RoleStatus, type Urgency } from "@/data/types";
import { useStore } from "@/store/AppStore";

export function HardHat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 22" className={className} aria-hidden="true">
      <path
        d="M4 18.6h24a2 2 0 0 0 0-4h-1.1v-1.9c0-4.2-2.6-7.8-6.3-9.3V6a1.4 1.4 0 0 1-1.4 1.4h-6.4A1.4 1.4 0 0 1 11.4 6V3.4C7.7 4.9 5.1 8.5 5.1 12.7v1.9H4a2 2 0 0 0 0 4Z"
        fill="currentColor"
      />
      <rect x="12.6" y="1" width="6.8" height="5" rx="1.4" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <HardHat className="h-6 w-8 text-safety" />
      <span className="font-head text-2xl font-bold uppercase leading-none tracking-wide text-white">
        Good<span className="text-safety">Hand</span>
      </span>
    </span>
  );
}

export function SampleDataBanner() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-warn/20 bg-warn-soft px-3 py-1.5 text-center text-xs font-semibold text-warn">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>Sample data. No real people, licenses or emails.</span>
    </div>
  );
}

export function PageHead({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-head text-3xl font-bold uppercase leading-none tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h1>
        {sub && <p className="mt-1.5 text-sm text-ink-500">{sub}</p>}
      </div>
      {children && <div className="flex shrink-0 gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  to,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
  accent?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <div className="gh-label">{label}</div>
      <div
        className={cn(
          "mt-1 font-head text-4xl font-bold leading-none",
          accent ? "text-safety-dark" : "text-ink-900",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1.5 text-xs leading-snug text-ink-400">{hint}</div>}
    </>
  );
  const base =
    "block rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card transition-colors";
  if (to) {
    return (
      <Link to={to} className={cn(base, "hover:border-ink-300 hover:bg-white", className)}>
        {inner}
      </Link>
    );
  }
  return <div className={cn(base, className)}>{inner}</div>;
}

const STATUS_VARIANT: Record<RoleStatus, "neutral" | "ok" | "ink" | "warn"> = {
  Sourcing: "neutral",
  Active: "ok",
  Filled: "ink",
  Paused: "warn",
};

export function StatusBadge({ status }: { status: RoleStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]}>
      {status === "Sourcing" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safety" />
      )}
      {status}
    </Badge>
  );
}

const URGENCY_VARIANT: Record<Urgency, "neutral" | "warn" | "bad"> = {
  Standard: "neutral",
  Urgent: "warn",
  Critical: "bad",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return <Badge variant={URGENCY_VARIANT[urgency]}>{urgency}</Badge>;
}

export function LicenseBadge({ type }: { type: LicenseType }) {
  return (
    <Badge variant="ink" className="font-mono text-[11px] tracking-wide">
      {LICENSE_SHORT[type]}
    </Badge>
  );
}

export function MatchScore({
  score,
  size = "md",
  tone = "light",
}: {
  score: number;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="shrink-0 text-right">
      <div
        className={cn(
          "gh-num font-head font-bold leading-none",
          dark ? "text-white" : "text-ink-900",
          size === "md" ? "text-2xl" : "text-xl",
        )}
      >
        {score}
        <span
          className={cn("text-sm font-semibold", dark ? "text-white/50" : "text-ink-300")}
        >
          /100
        </span>
      </div>
      <div
        className={cn(
          "mt-1 h-1.5 w-16 overflow-hidden rounded-full",
          dark ? "bg-white/20" : "bg-surface-sunk",
        )}
      >
        <div className="h-full rounded-full bg-safety" style={{ width: `${score}%` }} />
      </div>
      <div
        className={cn(
          "mt-0.5 text-[10px] font-semibold uppercase tracking-wide",
          dark ? "text-white/60" : "text-ink-400",
        )}
      >
        Match
      </div>
    </div>
  );
}

export function PlaceLine({
  county,
  miles,
  travel,
}: {
  county: string;
  miles: number;
  travel: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-600">
      <span className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" />
        {county} County
      </span>
      <span className="text-ink-300">|</span>
      <span className="gh-num">{miles} mi to site</span>
      <Badge variant={travel ? "ok" : "neutral"}>
        {travel ? "Will travel" : "Will not travel"}
      </Badge>
    </div>
  );
}

export function FunnelStrip({ roleId }: { roleId: string }) {
  const { roleStats } = useStore();
  const stats = roleStats(roleId);
  return (
    <div className="gh-scroll-x -mx-4 px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-stretch gap-1">
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage}>
            {i > 0 && (
              <ChevronRight className="my-auto h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
            )}
            <div
              className={cn(
                "min-w-[5.5rem] rounded-md border px-2.5 py-2",
                i >= 3
                  ? "border-ink-800 bg-ink-800 text-white"
                  : "border-surface-line bg-surface-raised",
              )}
            >
              <div className="gh-num font-head text-2xl font-bold leading-none">
                {stats.reached[stage]}
              </div>
              <div
                className={cn(
                  "mt-1 font-head text-[11px] font-semibold uppercase tracking-wide",
                  i >= 3 ? "text-white/70" : "text-ink-400",
                )}
              >
                {STAGE_LABELS_SHORT[stage]}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function InfoDot({
  title,
  children,
  label = "Show the math",
}: {
  title: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex min-h-9 items-center gap-1 rounded text-sm font-semibold text-safety-dark underline decoration-safety/40 underline-offset-2 hover:decoration-safety">
        <Info className="h-4 w-4" />
        {label}
      </PopoverTrigger>
      <PopoverContent>
        <div className="gh-label mb-2">{title}</div>
        {children}
      </PopoverContent>
    </Popover>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-surface-line bg-surface-raised p-5 text-center text-sm text-ink-400">
      {children}
    </div>
  );
}
