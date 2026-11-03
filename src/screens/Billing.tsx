import * as React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyNote, InfoDot, PageHead, StatCard } from "@/components/bits";
import { type Hire, type HireStatus } from "@/data/types";
import { ANNUAL_HOURS, daysUntil, fmtDate, fmtMoney } from "@/lib/format";
import { useStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

const STATUS_VARIANT: Record<HireStatus, "warn" | "neutral" | "ok"> = {
  "Pending start": "warn",
  "Invoice sent": "neutral",
  Paid: "ok",
};

function Guarantee({ hire }: { hire: Hire }) {
  const left = daysUntil(hire.guaranteeEndDate);
  if (hire.status === "Pending start") {
    return (
      <span className="text-sm text-ink-500">
        Guarantee starts {fmtDate(hire.startDate)}
      </span>
    );
  }
  if (left < 0) {
    return <span className="text-sm text-ink-400">Guarantee ended {fmtDate(hire.guaranteeEndDate)}</span>;
  }
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm font-semibold",
        left <= 30 ? "text-warn" : "text-ok",
      )}
    >
      <ShieldCheck className="h-4 w-4 shrink-0" />
      Free replacement until {fmtDate(hire.guaranteeEndDate)}
      <span className="gh-num">({left} days left)</span>
    </span>
  );
}

function PlanPicker({ hire }: { hire: Hire }) {
  const { setPaymentPlan } = useStore();
  const perMonth = Math.round(hire.feeAmount / 3);
  if (hire.status === "Paid") {
    return (
      <p className="text-sm text-ink-500">
        Paid in {hire.paymentPlan === "installments" ? "3 installments" : "full"}, invoice{" "}
        <span className="gh-num">{hire.invoiceNumber}</span>
      </p>
    );
  }
  return (
    <div>
      <div className="gh-label mb-1.5">How you want to pay</div>
      <div className="grid grid-cols-2 gap-1.5">
        {(
          [
            { v: "full", label: "Pay in full", sub: fmtMoney(hire.feeAmount) },
            {
              v: "installments",
              label: "3 monthly payments",
              sub: `${fmtMoney(perMonth)} a month`,
            },
          ] as const
        ).map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setPaymentPlan(hire.id, opt.v)}
            className={cn(
              "rounded-md border-2 px-3 py-2 text-left",
              hire.paymentPlan === opt.v
                ? "border-ink-900 bg-surface-sunk"
                : "border-surface-line bg-surface-raised",
            )}
          >
            <span className="block font-head text-base font-semibold uppercase tracking-wide text-ink-900">
              {opt.label}
            </span>
            <span className="gh-num block text-sm text-ink-500">{opt.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Billing() {
  const { hires, totals } = useStore();
  const sorted = [...hires].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return (
    <div>
      <PageHead title="Hires and billing" sub="One fee per hire, due when they start work" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Fees due this month"
          value={fmtMoney(totals.feesDueThisMonth)}
          hint="Invoices already sent"
          accent
        />
        <StatCard
          label="Fees paid to date"
          value={fmtMoney(totals.feesPaid)}
          hint="Thank you"
        />
        <StatCard
          label="Not yet invoiced"
          value={fmtMoney(totals.feesOutstanding - totals.feesDueThisMonth)}
          hint="Hires that have not started"
        />
      </div>

      {sorted.length === 0 && <EmptyNote>No hires yet.</EmptyNote>}

      {/* Phone: cards */}
      <ul className="space-y-3 lg:hidden">
        {sorted.map((hire) => (
          <li
            key={hire.id}
            className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-head text-xl font-semibold leading-none text-ink-900">
                  {hire.name}
                </h3>
                <p className="mt-1 text-sm text-ink-500">
                  {hire.roleTitle}, {hire.city}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[hire.status]}>{hire.status}</Badge>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-surface-line pt-3 text-sm">
              <div>
                <dt className="gh-label text-[10px]">Starts</dt>
                <dd className="gh-num font-semibold text-ink-900">{fmtDate(hire.startDate)}</dd>
              </div>
              <div>
                <dt className="gh-label text-[10px]">First year pay</dt>
                <dd className="gh-num font-semibold text-ink-900">
                  {fmtMoney(hire.firstYearPay)}
                </dd>
              </div>
              <div>
                <dt className="gh-label text-[10px]">Fee percent</dt>
                <dd className="gh-num font-semibold text-ink-900">{hire.feePercent}%</dd>
              </div>
              <div>
                <dt className="gh-label text-[10px]">Fee amount</dt>
                <dd className="gh-num font-head text-2xl font-bold leading-none text-safety-dark">
                  {fmtMoney(hire.feeAmount)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 border-t border-surface-line pt-3">
              <Guarantee hire={hire} />
            </div>
            <div className="mt-3">
              <PlanPicker hire={hire} />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-surface-line bg-surface-raised shadow-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hire</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead className="text-right">First year pay</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Fee amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((hire) => (
              <React.Fragment key={hire.id}>
                <TableRow className="border-0">
                  <TableCell className="font-head text-lg font-semibold">{hire.name}</TableCell>
                  <TableCell>
                    {hire.roleTitle}
                    <div className="text-xs text-ink-400">{hire.city}</div>
                  </TableCell>
                  <TableCell className="gh-num whitespace-nowrap">
                    {fmtDate(hire.startDate)}
                  </TableCell>
                  <TableCell className="gh-num text-right">
                    {fmtMoney(hire.firstYearPay)}
                    <div className="gh-num text-xs text-ink-400">
                      ${hire.hourlyRate}/hr x {ANNUAL_HOURS.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="gh-num text-right">{hire.feePercent}%</TableCell>
                  <TableCell className="gh-num text-right font-head text-xl font-bold text-safety-dark">
                    {fmtMoney(hire.feeAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[hire.status]}>{hire.status}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} className="bg-surface pt-0">
                    <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
                      <Guarantee hire={hire} />
                      <div className="min-w-[22rem]">
                        <PlanPicker hire={hire} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-surface-line bg-surface-raised p-4 text-sm text-ink-600">
        <InfoDot title="How the fee is worked out" label="How is the fee worked out">
          <p className="leading-relaxed">
            First year pay is the hourly rate times 2,080 hours. Overtime and per diem are not
            counted. We bill your agreed percent of that, once, after the hire starts work.
          </p>
        </InfoDot>
        <Link to="/settings" className="font-semibold text-safety-dark underline underline-offset-2">
          See your contract terms
        </Link>
      </div>
    </div>
  );
}
