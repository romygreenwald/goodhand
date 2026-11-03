import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHead } from "@/components/bits";
import { GOODHAND_LEGAL_NAME, GOODHAND_MAILING_ADDRESS } from "@/data/mock";
import { useStore } from "@/store/AppStore";

const SEQUENCE = [
  { label: "First email", when: "Goes out right away" },
  { label: "Follow up", when: "3 days later if no reply" },
  { label: "Last follow up", when: "7 days later if no reply" },
];

export default function Outreach() {
  const { roles, campaigns, campaignStats, updateEmail, updateRole, resetEmails, company, toast } =
    useStore();
  const [params, setParams] = useSearchParams();
  const initial = params.get("role");
  const [roleId, setRoleId] = React.useState(
    initial && roles.some((r) => r.id === initial) ? initial : roles[0]?.id ?? "",
  );
  const role = roles.find((r) => r.id === roleId);
  const campaign = campaigns.find((c) => c.roleId === roleId);

  React.useEffect(() => {
    if (initial && initial !== roleId) setParams({}, { replace: true });
  }, []);

  if (!role || !campaign) return null;
  const stats = campaignStats(roleId);

  return (
    <div>
      <PageHead title="Outreach" sub="The job offer we email on your behalf, in your words" />

      <div className="mb-4">
        <label className="gh-label mb-1 block" htmlFor="o-role">
          Role
        </label>
        <Select value={roleId} onValueChange={setRoleId}>
          <SelectTrigger id="o-role" className="sm:max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.title}, {r.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-ok/25 bg-ok-soft p-3.5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ok" />
        <p className="text-sm font-semibold leading-snug text-ok">
          GoodHand only sends genuine job offers. We never market other products in these emails.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {[
          ["Sent", stats.sent],
          ["Delivered", stats.delivered],
          ["Replied", stats.replied],
          ["Interested", stats.interested],
          ["Unsubscribed", stats.unsubscribed],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-lg border border-surface-line bg-surface-raised p-3 shadow-card"
          >
            <div className="gh-label text-[10px]">{label}</div>
            <div className="gh-num font-head text-3xl font-bold leading-none text-ink-900">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Sequence */}
      <section className="mb-6">
        <h2 className="gh-label mb-2">Sequence</h2>
        <ol className="grid gap-2 sm:grid-cols-3">
          {SEQUENCE.map((s, i) => (
            <li
              key={s.label}
              className="flex items-center gap-3 rounded-md border border-surface-line bg-surface-raised p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 font-head text-base font-bold text-safety">
                {i + 1}
              </span>
              <span>
                <span className="block font-head text-base font-semibold uppercase tracking-wide text-ink-900">
                  {s.label}
                </span>
                <span className="block text-xs text-ink-500">{s.when}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Offer details */}
      <section className="mb-6 rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
            What the offer says
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetEmails(roleId);
              toast("Emails rewritten from the role details");
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Rewrite from these details
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <Label htmlFor="o-paymin" className="mb-1.5 block">
              Pay, low
            </Label>
            <Input
              id="o-paymin"
              type="number"
              inputMode="decimal"
              className="gh-num"
              value={role.payMin}
              onChange={(e) => updateRole(roleId, { payMin: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="o-paymax" className="mb-1.5 block">
              Pay, high
            </Label>
            <Input
              id="o-paymax"
              type="number"
              inputMode="decimal"
              className="gh-num"
              value={role.payMax}
              onChange={(e) => updateRole(roleId, { payMax: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="o-perdiem" className="mb-1.5 block">
              Per diem
            </Label>
            <Input
              id="o-perdiem"
              type="number"
              inputMode="numeric"
              className="gh-num"
              value={role.perDiem}
              onChange={(e) => updateRole(roleId, { perDiem: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="o-start" className="mb-1.5 block">
              Start date
            </Label>
            <Input
              id="o-start"
              type="date"
              className="gh-num"
              value={role.startDate}
              onChange={(e) => updateRole(roleId, { startDate: e.target.value })}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Change these and hit rewrite, or edit the wording yourself below.
        </p>
      </section>

      {/* Emails */}
      <Tabs defaultValue="0">
        <TabsList>
          {campaign.emails.map((e, i) => (
            <TabsTrigger key={e.step} value={String(i)} className="text-sm sm:text-base">
              {i === 0 ? "First" : i === 1 ? "Follow up" : "Last"}
            </TabsTrigger>
          ))}
        </TabsList>

        {campaign.emails.map((email, i) => (
          <TabsContent key={email.step} value={String(i)}>
            <div className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="ink">{email.step}</Badge>
                <Badge variant="neutral">{SEQUENCE[i].when}</Badge>
                <Badge variant="ok">Saved as you type</Badge>
              </div>

              <Label htmlFor={`subject-${i}`} className="mb-1.5 block">
                Subject line
              </Label>
              <Input
                id={`subject-${i}`}
                value={email.subject}
                onChange={(e) => updateEmail(roleId, i, { subject: e.target.value })}
              />

              <Label htmlFor={`body-${i}`} className="mb-1.5 mt-4 block">
                Message
              </Label>
              <Textarea
                id={`body-${i}`}
                rows={14}
                className="font-mono text-sm leading-relaxed"
                value={email.body}
                onChange={(e) => updateEmail(roleId, i, { body: e.target.value })}
              />
              <p className="mt-1 text-xs text-ink-400">
                {"{{first name}}"} is swapped for the electrician's first name.
              </p>

              {/* Locked footer */}
              <div className="mt-4 rounded-md border-2 border-dashed border-surface-line bg-surface-sunk p-3.5">
                <div className="gh-label mb-2 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Required footer, cannot be removed
                </div>
                <div className="space-y-1 font-mono text-xs leading-relaxed text-ink-600">
                  <p>
                    {GOODHAND_LEGAL_NAME}, sourcing for {company.name}
                  </p>
                  <p>{GOODHAND_MAILING_ADDRESS}</p>
                  <p>
                    You got this because you hold an active Texas electrical license.{" "}
                    <span className="underline">Unsubscribe</span> and we will not email you again.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
