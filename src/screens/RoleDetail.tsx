import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { EmptyNote, FunnelStrip, StatusBadge, UrgencyBadge } from "@/components/bits";
import { BOARD_STAGES, STAGE_LABELS, type Stage } from "@/data/types";
import { fmtDate } from "@/lib/format";
import { useStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-head text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold text-white">{value}</div>
    </div>
  );
}

export default function RoleDetail() {
  const { roleId = "" } = useParams();
  const { roles, candidatesForRole, roleStats } = useStore();
  const role = roles.find((r) => r.id === roleId);
  const [stage, setStage] = React.useState<Stage>("interested");
  const [showNotFit, setShowNotFit] = React.useState(false);

  if (!role) {
    return (
      <div>
        <EmptyNote>That role is not here. It may have been removed.</EmptyNote>
        <Button asChild className="mt-4">
          <Link to="/roles">Back to roles</Link>
        </Button>
      </div>
    );
  }

  const stats = roleStats(role.id);
  const all = candidatesForRole(role.id);
  const byStage = (s: Stage) => all.filter((c) => c.stage === s);
  const notFit = all.filter((c) => c.stage === "not_a_fit");
  const pct = Math.min((stats.filled / role.hiresNeeded) * 100, 100);

  return (
    <div>
      <Link
        to="/roles"
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All roles
      </Link>

      {/* Role summary */}
      <section className="rounded-lg bg-ink-900 p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-head text-3xl font-bold uppercase leading-none tracking-tight text-white sm:text-4xl">
              {role.title}
            </h1>
            <p className="mt-1.5 text-base text-white/70">
              {role.city}, {role.county} County, {role.projectType.toLowerCase()}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={role.status} />
              <UrgencyBadge urgency={role.urgency} />
              <Badge variant="outline" className="border-white/30 text-white/80">
                {role.licenseType} license
              </Badge>
            </div>
          </div>
          <div className="shrink-0 rounded-md bg-white/5 p-3 sm:w-48">
            <div className="font-head text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              Hired
            </div>
            <div className="gh-num font-head text-4xl font-bold leading-none text-safety">
              {stats.filled}
              <span className="text-xl text-white/50"> of {role.hiresNeeded}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-safety" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-white/50">
              Open <span className="gh-num">{stats.daysOpen}</span> days
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-3 lg:grid-cols-5">
          <Fact
            label="Pay"
            value={
              <span className="gh-num">
                ${role.payMin} to ${role.payMax}/hr
              </span>
            }
          />
          <Fact label="Per diem" value={<span className="gh-num">${role.perDiem}/day</span>} />
          <Fact label="Starts" value={fmtDate(role.startDate)} />
          <Fact label="Length" value={`About ${role.durationMonths} months`} />
          <Fact
            label="Overtime"
            value={
              role.overtimeExpected ? (
                <span className="gh-num">{role.overtimeHours} hrs/week</span>
              ) : (
                "None expected"
              )
            }
          />
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-4">
          <span className="font-head text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Must have
          </span>
          {role.requirements.map((r) => (
            <Badge key={r} variant="outline" className="border-white/30 text-white/80">
              {r}
            </Badge>
          ))}
          <Badge variant="outline" className="border-white/30 text-white/80">
            Travel: {role.travelRadius.toLowerCase()}
          </Badge>
        </div>

        <Button asChild variant="dark" size="sm" className="mt-4">
          <Link to={`/outreach?role=${role.id}`}>
            <Mail className="h-4 w-4" />
            See the job offer we send
          </Link>
        </Button>
      </section>

      {/* Funnel */}
      <section className="mt-6">
        <h2 className="gh-label mb-2">How this role is going</h2>
        <FunnelStrip roleId={role.id} />
      </section>

      {/* Board */}
      <section className="mt-6">
        <h2 className="mb-3 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
          Candidates
        </h2>

        {/* Phone: stage picker */}
        <div className="lg:hidden">
          <div className="gh-scroll-x -mx-4 px-4 pb-2">
            <div className="flex min-w-max gap-2">
              {BOARD_STAGES.map((s) => {
                const n = byStage(s).length;
                const active = s === stage;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-md border-2 px-3 font-head text-base font-semibold uppercase tracking-wide",
                      active
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-surface-line bg-surface-raised text-ink-600",
                    )}
                  >
                    {STAGE_LABELS[s]}
                    <span
                      className={cn(
                        "gh-num rounded px-1.5 text-sm",
                        active ? "bg-safety text-ink-900" : "bg-surface-sunk text-ink-600",
                      )}
                    >
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {byStage(stage).length === 0 ? (
              <EmptyNote>
                Nobody in {STAGE_LABELS[stage].toLowerCase()} yet for this role.
              </EmptyNote>
            ) : (
              byStage(stage).map((c) => <CandidateCard key={c.id} candidate={c} />)
            )}
          </div>
        </div>

        {/* Desktop: kanban */}
        <div className="gh-scroll-x hidden pb-2 lg:block">
          <div className="flex min-w-max gap-3">
            {BOARD_STAGES.map((s) => {
              const list = byStage(s);
              return (
                <div key={s} className="w-[19rem] shrink-0">
                  <div className="mb-2 flex items-center justify-between rounded-md bg-surface-sunk px-3 py-2">
                    <span className="font-head text-base font-semibold uppercase tracking-wide text-ink-700">
                      {STAGE_LABELS[s]}
                    </span>
                    <span className="gh-num rounded bg-ink-800 px-1.5 text-sm font-semibold text-white">
                      {list.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {list.length === 0 ? (
                      <div className="rounded-md border border-dashed border-surface-line p-4 text-center text-xs text-ink-300">
                        Empty
                      </div>
                    ) : (
                      list.map((c) => <CandidateCard key={c.id} candidate={c} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Not a fit */}
      {notFit.length > 0 && (
        <section className="mt-6">
          <button
            type="button"
            onClick={() => setShowNotFit((v) => !v)}
            className="flex min-h-11 w-full items-center justify-between rounded-md border border-surface-line bg-surface-raised px-3 text-left"
          >
            <span className="font-head text-base font-semibold uppercase tracking-wide text-ink-600">
              Not a fit <span className="gh-num">({notFit.length})</span>
            </span>
            <ChevronDown
              className={cn("h-5 w-5 text-ink-400 transition-transform", showNotFit && "rotate-180")}
            />
          </button>
          {showNotFit && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {notFit.map((c) => (
                <CandidateCard key={c.id} candidate={c} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
