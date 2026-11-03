import * as React from "react";
import { ImagePlus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHead } from "@/components/bits";
import { useStore } from "@/store/AppStore";
import { fmtMoney } from "@/lib/format";

const ROLE_VARIANT = {
  Owner: "ink",
  "Hiring manager": "safety",
  Viewer: "neutral",
} as const;

const TERMS = [
  {
    title: "Placement fee",
    body: "You pay a percent of the hire's first year pay, once, when they start work. First year pay is the hourly rate times 2,080 hours. Overtime and per diem are not counted. Nothing is owed if a candidate never starts.",
  },
  {
    title: "90 day replacement guarantee",
    body: "If a hire leaves or does not work out in their first 90 days, we find you a replacement at no extra fee. You tell us within 5 business days of their last day.",
  },
  {
    title: "12 month attribution window",
    body: "If you hire someone we introduced within 12 months of the introduction, the placement fee applies, even if you hire them for a different role or project.",
  },
];

export default function Settings() {
  const { company, team, updateCompany } = useStore();

  return (
    <div className="space-y-6">
      <PageHead title="Settings" sub="Your company, your crew and your terms" />

      <section className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
        <h2 className="mb-4 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
          Company profile
        </h2>

        <div className="mb-4 flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-ink-900 font-head text-2xl font-bold text-safety">
            {company.logoInitials}
          </span>
          <div>
            <Button variant="outline" size="sm" disabled>
              <ImagePlus className="h-4 w-4" />
              Upload a logo
            </Button>
            <p className="mt-1 text-xs text-ink-400">PNG or JPG, at least 256 by 256</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="s-name" className="mb-1.5 block">
              Company name
            </Label>
            <Input
              id="s-name"
              value={company.name}
              onChange={(e) => updateCompany({ name: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="s-addr" className="mb-1.5 block">
              Street address
            </Label>
            <Input
              id="s-addr"
              value={company.address}
              onChange={(e) => updateCompany({ address: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="s-city" className="mb-1.5 block">
              City
            </Label>
            <Input
              id="s-city"
              value={company.city}
              onChange={(e) => updateCompany({ city: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s-state" className="mb-1.5 block">
                State
              </Label>
              <Input
                id="s-state"
                value={company.state}
                onChange={(e) => updateCompany({ state: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="s-zip" className="mb-1.5 block">
                Zip
              </Label>
              <Input
                id="s-zip"
                className="gh-num"
                value={company.zip}
                onChange={(e) => updateCompany({ zip: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="s-perdiem" className="mb-1.5 block">
              Default per diem per day
            </Label>
            <Input
              id="s-perdiem"
              type="number"
              inputMode="numeric"
              className="gh-num"
              value={company.defaultPerDiem}
              onChange={(e) => updateCompany({ defaultPerDiem: Number(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-ink-400">
              Used on new requests. {fmtMoney(company.defaultPerDiem)} a day right now.
            </p>
          </div>
          <div>
            <Label htmlFor="s-fee" className="mb-1.5 block">
              Default fee percent
            </Label>
            <Input
              id="s-fee"
              type="number"
              inputMode="numeric"
              min={15}
              max={20}
              className="gh-num"
              value={company.defaultFeePercent}
              onChange={(e) =>
                updateCompany({
                  defaultFeePercent: Math.min(Math.max(Number(e.target.value) || 15, 15), 20),
                })
              }
            />
            <p className="mt-1 text-xs text-ink-400">Between 15 and 20 percent per your contract</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
        <h2 className="mb-1 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
          Team
        </h2>
        <p className="mb-4 text-sm text-ink-500">
          Owners and hiring managers can request hires and introduce candidates. Viewers can look
          but not act.
        </p>
        <ul className="divide-y divide-surface-line">
          {team.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-sunk font-head text-base font-bold text-ink-700">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink-900">{m.name}</span>
                <span className="block truncate text-sm text-ink-500">{m.email}</span>
              </span>
              <Badge variant={ROLE_VARIANT[m.role]}>{m.role}</Badge>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-4" disabled>
          Add a team member
        </Button>
      </section>

      <section className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
        <h2 className="mb-1 flex items-center gap-2 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
          <ShieldCheck className="h-6 w-6 text-safety-dark" />
          Your terms, in plain language
        </h2>
        <p className="mb-4 text-sm text-ink-500">
          The short version of your signed agreement with {company.name}.
        </p>
        <dl className="space-y-4">
          {TERMS.map((t) => (
            <div key={t.title} className="rounded-md border-l-4 border-safety bg-safety-soft p-3.5">
              <dt className="font-head text-xl font-semibold uppercase tracking-tight text-ink-900">
                {t.title}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-700">{t.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-ink-400">
          Current fee on file: {company.defaultFeePercent}% of first year pay. This summary is here
          to be readable. The signed agreement is what governs.
        </p>
      </section>
    </div>
  );
}
