import * as React from "react";
import { Link } from "react-router-dom";
import { AlarmClock, ArrowRight, ChevronRight, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyNote, PageHead, StatCard, StatusBadge } from "@/components/bits";
import { useStore } from "@/store/AppStore";
import { TODAY, fmtMoney } from "@/lib/format";

const KIND_ICON = {
  interested: UserCheck,
  quiet: AlarmClock,
  guarantee: ShieldCheck,
} as const;

const KIND_LABEL = {
  interested: "Waiting on you",
  quiet: "No interest yet",
  guarantee: "Guarantee ending",
} as const;

export default function Home() {
  const { company, totals, attention, roles, roleStats, openCandidate } = useStore();
  const [showAll, setShowAll] = React.useState(false);
  const shown = showAll ? attention : attention.slice(0, 5);
  const openRoles = roles.filter((r) => r.status === "Active" || r.status === "Sourcing");

  return (
    <div>
      <div className="mb-5">
        <p className="gh-label">
          {TODAY.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 font-head text-3xl font-bold uppercase leading-[0.95] tracking-tight text-ink-900 sm:text-4xl">
          {company.name}
        </h1>
      </div>

      <Button asChild size="lg" className="mb-6 w-full sm:w-auto">
        <Link to="/request">
          Request a hire
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Open roles" value={totals.openRoles} hint="Sourcing or active" to="/roles" />
        <StatCard
          label="Contacted this week"
          value={totals.contactedThisWeek}
          hint="Licensed hands emailed"
          to="/outreach"
        />
        <StatCard
          label="Interested candidates"
          value={totals.interestedNow}
          hint="Said yes, waiting on you"
          to="/candidates"
          accent
        />
        <StatCard
          label="Hires this month"
          value={totals.hiresThisMonth}
          hint="Started work"
          to="/billing"
        />
        <StatCard
          label="Fees due"
          value={fmtMoney(totals.feesOutstanding)}
          hint="Not yet paid"
          to="/billing"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
            Needs your attention
          </h2>
          {attention.length > 5 && (
            <button
              type="button"
              className="text-sm font-semibold text-safety-dark underline underline-offset-2"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Show less" : `See all ${attention.length}`}
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <EmptyNote>Nothing needs you right now. We will email you when it does.</EmptyNote>
        ) : (
          <ul className="space-y-2">
            {shown.map((item) => {
              const Icon = KIND_ICON[item.kind];
              const body = (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-safety-soft text-safety-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Badge variant="neutral" className="mb-1">
                      {KIND_LABEL[item.kind]}
                    </Badge>
                    <div className="font-head text-xl font-semibold leading-tight text-ink-900">
                      {item.title}
                    </div>
                    <p className="mt-0.5 text-sm leading-snug text-ink-500">{item.detail}</p>
                  </div>
                  <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-ink-300" />
                </div>
              );
              const cls =
                "block w-full rounded-lg border border-surface-line bg-surface-raised p-3.5 text-left shadow-card hover:border-ink-300";
              return (
                <li key={item.id}>
                  {item.candidateId ? (
                    <button
                      type="button"
                      className={cls}
                      onClick={() => openCandidate(item.candidateId!)}
                    >
                      {body}
                    </button>
                  ) : (
                    <Link to={item.to} className={cls}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
          Your open roles
        </h2>
        <ul className="space-y-2">
          {openRoles.map((role) => {
            const stats = roleStats(role.id);
            return (
              <li key={role.id}>
                <Link
                  to={`/roles/${role.id}`}
                  className="flex items-center gap-3 rounded-lg border border-surface-line bg-surface-raised p-3.5 shadow-card hover:border-ink-300"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-head text-xl font-semibold leading-tight text-ink-900">
                      {role.title}
                    </div>
                    <div className="mt-0.5 text-sm text-ink-500">
                      {role.city}, {role.county} County
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={role.status} />
                      <Badge variant="neutral">
                        <span className="gh-num">
                          {stats.filled} of {role.hiresNeeded}
                        </span>{" "}
                        hired
                      </Badge>
                      {stats.interestedNow > 0 && (
                        <Badge variant="safety">
                          <span className="gh-num">{stats.interestedNow}</span> interested
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-300" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
