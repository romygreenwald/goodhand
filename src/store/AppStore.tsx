import * as React from "react";
import {
  type Campaign,
  type Candidate,
  type Company,
  type Hire,
  type OutreachEmail,
  type PaymentPlan,
  type Role,
  type Stage,
  type TeamMember,
  STAGES,
} from "@/data/types";
import {
  CAMPAIGNS,
  CANDIDATES,
  COMPANY,
  HIRES,
  ROLES,
  TEAM,
  buildEmails,
} from "@/data/mock";
import {
  TODAY,
  daysSince,
  daysUntil,
  firstYearPay,
  isoDaysAgo,
  parseDate,
  toIso,
  todayIso,
} from "@/lib/format";

export interface RoleCounts {
  matched: number;
  emailed: number;
  replied: number;
  interested: number;
  introduced: number;
  interviewing: number;
  hired: number;
  started: number;
}

export interface RoleStats {
  /** Cumulative funnel: how many candidates got at least this far. */
  reached: RoleCounts;
  /** Where candidates sit right now. */
  current: RoleCounts;
  contacted: number;
  interestedNow: number;
  filled: number;
  notAFit: number;
  daysOpen: number;
  newForReview: number;
}

export interface AttentionItem {
  id: string;
  kind: "interested" | "quiet" | "guarantee";
  title: string;
  detail: string;
  to: string;
  candidateId?: string;
}

interface Toast {
  id: number;
  message: string;
}

interface Store {
  roles: Role[];
  candidates: Candidate[];
  hires: Hire[];
  campaigns: Campaign[];
  company: Company;
  team: TeamMember[];
  /* derived */
  roleStats: (roleId: string) => RoleStats;
  candidatesForRole: (roleId: string) => Candidate[];
  totals: {
    openRoles: number;
    contactedThisWeek: number;
    interestedNow: number;
    hiresThisMonth: number;
    feesOutstanding: number;
    feesDueThisMonth: number;
    feesPaid: number;
  };
  attention: AttentionItem[];
  campaignStats: (roleId: string) => {
    sent: number;
    delivered: number;
    replied: number;
    interested: number;
    unsubscribed: number;
  };
  /* actions */
  moveCandidate: (id: string, stage: Stage) => void;
  introduceCandidate: (id: string) => void;
  markNotAFit: (id: string, reason: string) => void;
  setNotes: (id: string, notes: string) => void;
  markReviewed: (id: string) => void;
  addRole: (role: Omit<Role, "id" | "status" | "openedDate">) => string;
  updateRole: (roleId: string, patch: Partial<Role>) => void;
  updateEmail: (roleId: string, index: number, patch: Partial<OutreachEmail>) => void;
  resetEmails: (roleId: string) => void;
  updateCompany: (patch: Partial<Company>) => void;
  setPaymentPlan: (hireId: string, plan: PaymentPlan) => void;
  /* candidate drawer */
  openCandidateId: string | null;
  openCandidate: (id: string) => void;
  closeCandidate: () => void;
  /* toast */
  toasts: Toast[];
  toast: (message: string) => void;
}

const StoreContext = React.createContext<Store | null>(null);

function emptyCounts(): RoleCounts {
  return {
    matched: 0,
    emailed: 0,
    replied: 0,
    interested: 0,
    introduced: 0,
    interviewing: 0,
    hired: 0,
    started: 0,
  };
}

const NEW_CANDIDATE_POOL = [
  { first: "Bobby", last: "J", city: "Midland", county: "Midland", mi: 44, emp: "industrial contractor", score: 90, since: 2012, travel: true, area: "432" },
  { first: "Elena", last: "C", city: "Waco", county: "McLennan", mi: 52, emp: "commercial contractor", score: 87, since: 2015, travel: true, area: "254" },
  { first: "Raymond", last: "P", city: "Tyler", county: "Smith", mi: 96, emp: "data center contractor", score: 85, since: 2010, travel: true, area: "903" },
  { first: "Shanice", last: "B", city: "Bryan", county: "Brazos", mi: 71, emp: "utility contractor", score: 82, since: 2017, travel: false, area: "979" },
  { first: "Jesse", last: "V", city: "Victoria", county: "Victoria", mi: 88, emp: "manufacturing plant", score: 79, since: 2013, travel: true, area: "361" },
  { first: "Kurt", last: "N", city: "Amarillo", county: "Potter", mi: 160, emp: "oil and gas contractor", score: 76, since: 2019, travel: true, area: "806" },
];

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = React.useState<Role[]>(ROLES);
  const [candidates, setCandidates] = React.useState<Candidate[]>(CANDIDATES);
  const [hires, setHires] = React.useState<Hire[]>(HIRES);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(CAMPAIGNS);
  const [company, setCompany] = React.useState<Company>(COMPANY);
  const [team] = React.useState<TeamMember[]>(TEAM);
  const [openCandidateId, setOpenCandidateId] = React.useState<string | null>(null);
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addTimeline = (c: Candidate, label: string): Candidate => ({
    ...c,
    timeline: [...c.timeline, { label, date: todayIso() }],
  });

  const moveCandidate = React.useCallback(
    (id: string, stage: Stage) => {
      let moved: Candidate | undefined;
      let role: Role | undefined;
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const peak =
            STAGES.indexOf(stage) > STAGES.indexOf(c.peakStage) ? stage : c.peakStage;
          const next: Candidate = addTimeline(
            {
              ...c,
              stage,
              peakStage: peak,
              reviewed: true,
              notAFitReason: undefined,
              contactRevealed:
                c.contactRevealed || STAGES.indexOf(stage) >= STAGES.indexOf("introduced"),
            },
            stage === "hired"
              ? "Marked hired"
              : stage === "started"
                ? "Started work"
                : stage === "interviewing"
                  ? "Moved to interviewing"
                  : `Moved to ${stage}`,
          );
          moved = next;
          return next;
        }),
      );
      role = roles.find((r) => r.id === candidates.find((c) => c.id === id)?.roleId);
      if (!role || !moved) return;
      const cand = moved;
      const theRole = role;

      if (stage === "hired") {
        setHires((prev) => {
          if (prev.some((h) => h.candidateId === id)) return prev;
          const hourly = Math.min(
            Math.max(cand.preferredPay ?? theRole.payMin, theRole.payMin),
            theRole.payMax,
          );
          const base = firstYearPay(hourly);
          return [
            ...prev,
            {
              id: `hire-${id}`,
              candidateId: id,
              name: `${cand.firstName} ${cand.lastInitial}.`,
              roleId: theRole.id,
              roleTitle: theRole.title,
              city: theRole.city,
              startDate: cand.availabilityDate ?? theRole.startDate,
              hourlyRate: hourly,
              firstYearPay: base,
              feePercent: theRole.feePercent,
              feeAmount: Math.round((base * theRole.feePercent) / 100),
              status: "Pending start",
              guaranteeEndDate: toIso(
                new Date(
                  parseDate(cand.availabilityDate ?? theRole.startDate).getTime() +
                    90 * 86400000,
                ),
              ),
              paymentPlan: "full",
              invoiceNumber: `GH-${1100 + prev.length}`,
            },
          ];
        });
      }
      if (stage === "started") {
        setHires((prev) =>
          prev.map((h) =>
            h.candidateId === id
              ? {
                  ...h,
                  status: h.status === "Paid" ? h.status : "Invoice sent",
                  startDate: todayIso(),
                  guaranteeEndDate: toIso(new Date(TODAY.getTime() + 90 * 86400000)),
                }
              : h,
          ),
        );
      }
    },
    [candidates, roles],
  );

  const introduceCandidate = React.useCallback((id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? addTimeline(
              {
                ...c,
                stage: "introduced",
                peakStage:
                  STAGES.indexOf("introduced") > STAGES.indexOf(c.peakStage)
                    ? "introduced"
                    : c.peakStage,
                contactRevealed: true,
                reviewed: true,
              },
              "Introduced to you",
            )
          : c,
      ),
    );
  }, []);

  const markNotAFit = React.useCallback((id: string, reason: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? addTimeline(
              { ...c, stage: "not_a_fit", notAFitReason: reason, reviewed: true },
              `Not a fit: ${reason}`,
            )
          : c,
      ),
    );
  }, []);

  const setNotes = React.useCallback((id: string, notes: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
  }, []);

  const markReviewed = React.useCallback((id: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, reviewed: true } : c)));
  }, []);

  const addRole = React.useCallback(
    (draft: Omit<Role, "id" | "status" | "openedDate">) => {
      const id = `role-${Date.now()}`;
      const role: Role = { ...draft, id, status: "Sourcing", openedDate: todayIso() };
      setRoles((prev) => [role, ...prev]);
      setCampaigns((prev) => [
        ...prev,
        { roleId: id, emails: buildEmails(role, company), bounced: 0, unsubscribed: 0 },
      ]);
      setCandidates((prev) => [
        ...prev,
        ...NEW_CANDIDATE_POOL.slice(0, 6).map((p, i) => ({
          id: `cand-${id}-${i}`,
          roleId: id,
          firstName: p.first,
          lastInitial: p.last,
          licenseType: role.licenseType,
          licenseNumber: `TX-JM-${410000 + i * 913}`,
          licenseExpires: "2027-09-28",
          licensedSince: p.since,
          city: p.city,
          county: p.county,
          distanceMiles: p.mi,
          willingToTravel: p.travel,
          employerType: p.emp,
          matchScore: p.score,
          stage: (i < 4 ? "emailed" : "matched") as Stage,
          peakStage: (i < 4 ? "emailed" : "matched") as Stage,
          contactedDate: i < 4 ? todayIso() : undefined,
          phone: `(${p.area}) 555-07${String(10 + i).slice(-2)}`,
          email: `${p.first.toLowerCase()}.${p.last.toLowerCase()}@example.com`,
          verifiedDate: todayIso(),
          reviewed: true,
          contactRevealed: false,
          notes: "",
          timeline: [
            { label: "Matched from Texas license records", date: todayIso() },
            ...(i < 4 ? [{ label: "Job offer emailed", date: todayIso() }] : []),
          ],
        })),
      ]);
      return id;
    },
    [company],
  );

  const updateRole = React.useCallback((roleId: string, patch: Partial<Role>) => {
    setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, ...patch } : r)));
  }, []);

  const updateEmail = React.useCallback(
    (roleId: string, index: number, patch: Partial<OutreachEmail>) => {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.roleId === roleId
            ? {
                ...c,
                emails: c.emails.map((e, i) => (i === index ? { ...e, ...patch } : e)),
              }
            : c,
        ),
      );
    },
    [],
  );

  const resetEmails = React.useCallback(
    (roleId: string) => {
      const role = roles.find((r) => r.id === roleId);
      if (!role) return;
      setCampaigns((prev) =>
        prev.map((c) => (c.roleId === roleId ? { ...c, emails: buildEmails(role, company) } : c)),
      );
    },
    [roles, company],
  );

  const updateCompany = React.useCallback((patch: Partial<Company>) => {
    setCompany((prev) => ({ ...prev, ...patch }));
  }, []);

  const setPaymentPlan = React.useCallback((hireId: string, plan: PaymentPlan) => {
    setHires((prev) => prev.map((h) => (h.id === hireId ? { ...h, paymentPlan: plan } : h)));
  }, []);

  const candidatesForRole = React.useCallback(
    (roleId: string) => candidates.filter((c) => c.roleId === roleId),
    [candidates],
  );

  const roleStats = React.useCallback(
    (roleId: string): RoleStats => {
      const role = roles.find((r) => r.id === roleId);
      const list = candidates.filter((c) => c.roleId === roleId);
      const reached = emptyCounts();
      const current = emptyCounts();
      list.forEach((c) => {
        const peak = STAGES.indexOf(c.peakStage);
        STAGES.forEach((s, i) => {
          if (peak >= i) reached[s] += 1;
        });
        if (c.stage !== "not_a_fit") current[c.stage] += 1;
      });
      return {
        reached,
        current,
        contacted: list.filter((c) => c.contactedDate).length,
        interestedNow: list.filter((c) => c.stage === "interested").length,
        filled: list.filter((c) => c.stage === "hired" || c.stage === "started").length,
        notAFit: list.filter((c) => c.stage === "not_a_fit").length,
        daysOpen: role ? daysSince(role.openedDate) : 0,
        newForReview: list.filter((c) => c.stage === "interested" && !c.reviewed).length,
      };
    },
    [candidates, roles],
  );

  const campaignStats = React.useCallback(
    (roleId: string) => {
      const camp = campaigns.find((c) => c.roleId === roleId);
      const stats = roleStats(roleId);
      const sent = stats.contacted;
      return {
        sent,
        delivered: Math.max(sent - (camp?.bounced ?? 0), 0),
        replied: stats.reached.replied,
        interested: stats.reached.interested,
        unsubscribed: camp?.unsubscribed ?? 0,
      };
    },
    [campaigns, roleStats],
  );

  const totals = React.useMemo(() => {
    const weekAgo = isoDaysAgo(7);
    const openRoles = roles.filter((r) => r.status === "Active" || r.status === "Sourcing").length;
    const contactedThisWeek = candidates.filter(
      (c) => c.contactedDate && c.contactedDate >= weekAgo,
    ).length;
    const interestedNow = candidates.filter((c) => c.stage === "interested").length;
    const month = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, "0")}`;
    const hiresThisMonth = hires.filter((h) => h.startDate.startsWith(month)).length;
    const feesOutstanding = hires
      .filter((h) => h.status !== "Paid")
      .reduce((sum, h) => sum + h.feeAmount, 0);
    const feesDueThisMonth = hires
      .filter((h) => h.status === "Invoice sent")
      .reduce((sum, h) => sum + h.feeAmount, 0);
    const feesPaid = hires
      .filter((h) => h.status === "Paid")
      .reduce((sum, h) => sum + h.feeAmount, 0);
    return {
      openRoles,
      contactedThisWeek,
      interestedNow,
      hiresThisMonth,
      feesOutstanding,
      feesDueThisMonth,
      feesPaid,
    };
  }, [roles, candidates, hires]);

  const attention = React.useMemo<AttentionItem[]>(() => {
    const items: AttentionItem[] = [];
    candidates
      .filter((c) => c.stage === "interested" && !c.reviewed)
      .sort((a, b) => b.matchScore - a.matchScore)
      .forEach((c) => {
        const role = roles.find((r) => r.id === c.roleId);
        items.push({
          id: `att-cand-${c.id}`,
          kind: "interested",
          title: `${c.firstName} ${c.lastInitial}. is interested`,
          detail: `${role?.title ?? "Role"} in ${role?.city ?? ""}. Match ${c.matchScore} out of 100. Waiting on you.`,
          to: `/roles/${c.roleId}`,
          candidateId: c.id,
        });
      });
    roles
      .filter((r) => r.status === "Active" || r.status === "Sourcing")
      .forEach((r) => {
        const stats = roleStats(r.id);
        if (stats.daysOpen >= 5 && stats.reached.interested === 0) {
          items.push({
            id: `att-role-${r.id}`,
            kind: "quiet",
            title: `No interest yet on ${r.title} in ${r.city}`,
            detail: `Open ${stats.daysOpen} days, ${stats.contacted} contacted. Pay or travel range may be too tight.`,
            to: `/roles/${r.id}`,
          });
        }
      });
    hires.forEach((h) => {
      const left = daysUntil(h.guaranteeEndDate);
      if (h.status !== "Pending start" && left >= 0 && left <= 30) {
        items.push({
          id: `att-hire-${h.id}`,
          kind: "guarantee",
          title: `Replacement guarantee ending for ${h.name}`,
          detail: `Free replacement until ${h.guaranteeEndDate}. ${left} days left.`,
          to: "/billing",
        });
      }
    });
    return items;
  }, [candidates, roles, hires, roleStats]);

  const value: Store = {
    roles,
    candidates,
    hires,
    campaigns,
    company,
    team,
    roleStats,
    candidatesForRole,
    totals,
    attention,
    campaignStats,
    moveCandidate,
    introduceCandidate,
    markNotAFit,
    setNotes,
    markReviewed,
    addRole,
    updateRole,
    updateEmail,
    resetEmails,
    updateCompany,
    setPaymentPlan,
    openCandidateId,
    openCandidate: setOpenCandidateId,
    closeCandidate: () => setOpenCandidateId(null),
    toasts,
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}
