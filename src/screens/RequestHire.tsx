import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoDot, PageHead } from "@/components/bits";
import {
  LICENSE_PLURAL,
  LICENSE_TYPES,
  PROJECT_TYPES,
  REQUIREMENTS,
  ROLE_TITLES,
  TRADES,
  TRAVEL_RADIUS,
  URGENCIES,
  type LicenseType,
  type ProjectType,
  type Requirement,
  type Role,
  type RoleTitle,
  type TravelRadius,
  type Urgency,
} from "@/data/types";
import { ANNUAL_HOURS, feeRange, firstYearPay, fmtMoney, isoDaysAhead } from "@/lib/format";
import { useStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

const EXAMPLE =
  "6 journeyman electricians for a data center in Abilene, start Dec 1, $36/hr plus per diem";

const CITY_COUNTY: Record<string, string> = {
  Abilene: "Taylor",
  Temple: "Bell",
  "Fort Worth": "Tarrant",
  "San Antonio": "Bexar",
  Midland: "Midland",
  Odessa: "Ector",
  Waco: "McLennan",
  Lubbock: "Lubbock",
  Austin: "Travis",
  Dallas: "Dallas",
  Houston: "Harris",
  Amarillo: "Potter",
  "Round Rock": "Williamson",
  Killeen: "Bell",
  Sweetwater: "Nolan",
  "El Paso": "El Paso",
  Laredo: "Webb",
  "Corpus Christi": "Nueces",
  Tyler: "Smith",
  Bryan: "Brazos",
  Denton: "Denton",
  Plano: "Collin",
  Arlington: "Tarrant",
  "San Angelo": "Tom Green",
  Victoria: "Victoria",
};

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

interface Draft {
  trade: "Electrician";
  licenseType: LicenseType;
  title: RoleTitle;
  hiresNeeded: number;
  projectType: ProjectType;
  city: string;
  county: string;
  startDate: string;
  durationMonths: number;
  payMin: number;
  payMax: number;
  overtimeExpected: boolean;
  overtimeHours: number;
  perDiem: number;
  travelRadius: TravelRadius;
  requirements: Requirement[];
  urgency: Urgency;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

function parseDescription(text: string): { patch: Partial<Draft>; filled: string[] } {
  const t = text.toLowerCase();
  const patch: Partial<Draft> = {};
  const filled: string[] = [];
  const add = (label: string) => {
    if (!filled.includes(label)) filled.push(label);
  };

  const hires = t.match(
    /(\d{1,2})\s*(?:more\s*)?(?:journeyman|journeymen|electrician|electricians|foreman|foremen|hands?|guys|gals|people|techs?|technicians?|wiremen|wireman|sparkies)/,
  );
  if (hires) {
    patch.hiresNeeded = clamp(Number(hires[1]), 1, 99);
    add("Number of hires");
  }

  const range = t.match(/\$?\s?(\d{2})\s*(?:to|-|and)\s*\$?\s?(\d{2})\s*(?:\/|an?\s*)?(?:hr|hour)?/);
  const single = t.match(/\$\s?(\d{2}(?:\.\d{1,2})?)\s*(?:\/|\s*an?\s*|\s*per\s*)?\s*(?:hr|hour)/);
  if (range && Number(range[2]) > Number(range[1])) {
    patch.payMin = Number(range[1]);
    patch.payMax = Number(range[2]);
    add("Pay range");
  } else if (single) {
    const r = Number(single[1]);
    patch.payMin = r;
    patch.payMax = Math.round(r * 1.12);
    add("Pay range");
  }

  const pd =
    t.match(/per\s*diem[^0-9]{0,14}\$?\s?(\d{2,3})/) ||
    t.match(/\$\s?(\d{2,3})\s*(?:a|per|\/)\s*day/);
  if (pd) {
    patch.perDiem = Number(pd[1]);
    add("Per diem");
  }

  if (t.includes("journeyman industrial") || t.includes("industrial journeyman")) {
    patch.licenseType = "Journeyman Industrial";
  } else if (t.includes("master")) {
    patch.licenseType = "Master";
  } else if (t.includes("residential wireman")) {
    patch.licenseType = "Residential Wireman";
  } else if (t.includes("apprentice")) {
    patch.licenseType = "Apprentice";
  } else if (t.includes("journeyman") || t.includes("journeymen")) {
    patch.licenseType = "Journeyman";
  }
  if (patch.licenseType) add("Texas license");

  if (t.includes("general foreman")) patch.title = "General foreman";
  else if (t.includes("foreman")) patch.title = "Foreman";
  else if (t.includes("medium voltage") || t.includes("mv ")) {
    patch.title = "Medium voltage specialist";
  } else if (t.includes("commissioning")) patch.title = "Commissioning technician";
  else if (t.includes("wireman") || t.includes("journeyman") || t.includes("electrician")) {
    patch.title = "Journeyman wireman";
  }
  if (patch.title) add("Role");

  if (t.includes("data center") || t.includes("datacenter")) patch.projectType = "Data center";
  else if (t.includes("substation") || t.includes("utility")) {
    patch.projectType = "Utility or substation";
  } else if (t.includes("industrial") || t.includes("plant")) patch.projectType = "Industrial";
  else if (t.includes("commercial")) patch.projectType = "Commercial";
  if (patch.projectType) add("Project type");

  for (const city of Object.keys(CITY_COUNTY)) {
    if (t.includes(city.toLowerCase())) {
      patch.city = city;
      patch.county = CITY_COUNTY[city];
      add("Job site");
      break;
    }
  }

  const dm = t.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})(?:st|nd|rd|th)?/,
  );
  if (dm) {
    const month = MONTHS.indexOf(dm[1]);
    const day = clamp(Number(dm[2]), 1, 31);
    const now = new Date(2026, 10, 2);
    const year = month < now.getMonth() ? now.getFullYear() + 1 : now.getFullYear();
    patch.startDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    add("Start date");
  } else if (t.includes("asap") || t.includes("right away") || t.includes("yesterday")) {
    patch.startDate = isoDaysAhead(14);
    add("Start date");
  }

  const years = t.match(/(\d)\s*year/);
  const months = t.match(/(\d{1,2})\s*month/);
  if (years) {
    patch.durationMonths = clamp(Number(years[1]) * 12, 1, 60);
    add("Duration");
  } else if (months) {
    patch.durationMonths = clamp(Number(months[1]), 1, 60);
    add("Duration");
  }

  if (t.includes("critical") || t.includes("emergency") || t.includes("shut down")) {
    patch.urgency = "Critical";
    add("Urgency");
  } else if (t.includes("asap") || t.includes("urgent") || t.includes("right away")) {
    patch.urgency = "Urgent";
    add("Urgency");
  }

  if (t.includes("anywhere in texas") || t.includes("statewide") || t.includes("whole state")) {
    patch.travelRadius = "Anywhere in Texas";
    add("Travel");
  } else if (t.includes("per diem") || t.includes("travel")) {
    patch.travelRadius = "Within 150 miles";
    add("Travel");
  } else if (t.includes("local only") || t.includes("no travel")) {
    patch.travelRadius = "Within 50 miles";
    add("Travel");
  }

  const otHours = t.match(/(\d{2})\s*(?:hour|hr)s?\s*(?:a|per)\s*week/);
  if (otHours) {
    patch.overtimeExpected = true;
    patch.overtimeHours = clamp(Number(otHours[1]), 40, 84);
    add("Overtime");
  } else if (t.includes("tens") || t.includes("overtime") || t.includes(" ot ")) {
    patch.overtimeExpected = true;
    patch.overtimeHours = 55;
    add("Overtime");
  }

  const reqs: Requirement[] = [];
  if (t.includes("osha 30")) reqs.push("OSHA 30");
  else if (t.includes("osha")) reqs.push("OSHA 10");
  if (t.includes("70e")) reqs.push("NFPA 70E");
  if (t.includes("driver")) reqs.push("Valid driver's license");
  if (t.includes("drug")) reqs.push("Drug test");
  if (t.includes("background")) reqs.push("Background check");
  if (reqs.length) {
    patch.requirements = reqs;
    add("Requirements");
  }

  return { patch, filled };
}

function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-surface-line bg-surface-raised p-4 shadow-card sm:p-5">
      <h2 className="mb-4 flex items-center gap-2.5 font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-ink-900 text-base text-safety">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-12 rounded-md border-2 px-2 font-head text-base font-semibold uppercase tracking-wide",
            value === o.value
              ? "border-ink-900 bg-ink-900 text-white"
              : "border-surface-line bg-surface-raised text-ink-600",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FeePanel({ draft }: { draft: Draft }) {
  const { low, high, base } = feeRange(draft.payMin);
  const hires = Math.max(draft.hiresNeeded, 1);
  return (
    <div className="rounded-lg border-2 border-safety bg-safety-soft p-4">
      <div className="gh-label text-safety-dark">Estimated fee per hire</div>
      <div className="gh-num mt-1 font-head text-3xl font-bold leading-none text-ink-900">
        {fmtMoney(low)} to {fmtMoney(high)}
      </div>
      <p className="mt-2 text-sm leading-snug text-ink-600">
        15 to 20% of <span className="gh-num font-semibold">{fmtMoney(base)}</span> first year pay
      </p>
      <div className="mt-2">
        <InfoDot title="How we work that out">
          <div className="space-y-1.5">
            <p className="gh-num">
              ${draft.payMin.toFixed(2)}/hr x {ANNUAL_HOURS.toLocaleString()} hours ={" "}
              {fmtMoney(base)}
            </p>
            <p className="gh-num">15% of {fmtMoney(base)} = {fmtMoney(low)}</p>
            <p className="gh-num">20% of {fmtMoney(base)} = {fmtMoney(high)}</p>
            <p className="pt-1 text-ink-500">
              We use the low end of your hourly range and a 2,080 hour year. Overtime and per diem
              are not counted. The fee is due when the hire starts work.
            </p>
          </div>
        </InfoDot>
      </div>
      {hires > 1 && (
        <div className="mt-3 border-t border-safety/25 pt-3">
          <div className="gh-label text-safety-dark">For all {hires} hires</div>
          <div className="gh-num mt-0.5 text-lg font-semibold text-ink-900">
            {fmtMoney(low * hires)} to {fmtMoney(high * hires)}
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-snug text-ink-500">
        Nothing is owed until a hire starts. Free replacement for 90 days.
      </p>
    </div>
  );
}

function Sourcing({ draft, roleId }: { draft: Draft; roleId: string }) {
  const pool =
    draft.travelRadius === "Within 50 miles"
      ? 380
      : draft.travelRadius === "Within 150 miles"
        ? 1240
        : 3160;
  const matching = Math.round(pool * 0.33);
  const licLabel = LICENSE_PLURAL[draft.licenseType];
  const steps = React.useMemo(
    () => [
      "Scanning Texas license records",
      `${pool.toLocaleString()} licensed ${licLabel} within range`,
      `${matching.toLocaleString()} match your requirements`,
      "Finding contact info",
      "Sending job offers",
    ],
    [pool, matching, licLabel],
  );
  const [done, setDone] = React.useState(0);

  React.useEffect(() => {
    if (done >= steps.length) return;
    const t = window.setTimeout(() => setDone((d) => d + 1), done === 0 ? 700 : 950);
    return () => window.clearTimeout(t);
  }, [done, steps.length]);

  const finished = done >= steps.length;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-lg bg-ink-900 p-5 text-white shadow-card">
        <Badge variant="safety" className="mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          GoodHand is working
        </Badge>
        <h1 className="font-head text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
          We are finding matching electricians now
        </h1>
        <p className="mt-2 text-base text-white/70">
          {draft.hiresNeeded} {draft.title.toLowerCase()}
          {draft.hiresNeeded > 1 ? " spots" : " spot"} in {draft.city}, {draft.county} County
        </p>

        <ol className="mt-5 space-y-3">
          {steps.map((s, i) => {
            const state = i < done ? "done" : i === done ? "running" : "waiting";
            return (
              <li
                key={s}
                className={cn(
                  "flex items-start gap-3 text-base",
                  state === "waiting" ? "text-white/30" : "text-white",
                )}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                  {state === "done" && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-safety text-ink-900">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </span>
                  )}
                  {state === "running" && <Loader2 className="h-5 w-5 animate-spin text-safety" />}
                  {state === "waiting" && (
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  )}
                </span>
                <span className={cn(state === "done" && "font-semibold")}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {finished && (
        <div className="mt-4 animate-pop-in rounded-lg border border-surface-line bg-surface-raised p-5 shadow-card">
          <h2 className="font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
            Job offers are going out
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-600">
            We emailed the strongest matches first and will follow up twice over the next week.
            Interested electricians land in this role as they reply, usually within two days. We
            will text you when the first one says yes.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <Link to={`/roles/${roleId}`}>See this role</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RequestHire() {
  const { company, addRole, toast } = useStore();
  const navigate = useNavigate();
  const [describe, setDescribe] = React.useState("");
  const [filling, setFilling] = React.useState(false);
  const [filled, setFilled] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState<{ draft: Draft; roleId: string } | null>(null);
  const [touched, setTouched] = React.useState(false);

  const [draft, setDraft] = React.useState<Draft>({
    trade: "Electrician",
    licenseType: "Journeyman",
    title: "Journeyman wireman",
    hiresNeeded: 2,
    projectType: "Data center",
    city: "",
    county: "",
    startDate: "",
    durationMonths: 12,
    payMin: 36,
    payMax: 40,
    overtimeExpected: true,
    overtimeHours: 50,
    perDiem: company.defaultPerDiem,
    travelRadius: "Within 150 miles",
    requirements: ["OSHA 10", "Valid driver's license"],
    urgency: "Standard",
  });

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const runFill = () => {
    const text = describe.trim() || EXAMPLE;
    if (!describe.trim()) setDescribe(EXAMPLE);
    setFilling(true);
    setFilled([]);
    window.setTimeout(() => {
      const { patch, filled: labels } = parseDescription(text);
      setFilling(false);
      if (labels.length === 0) {
        toast("We could not pull details out of that. Fill in what you can below.");
        return;
      }
      setDraft((d) => ({ ...d, ...patch, county: patch.county ?? d.county }));
      setFilled(labels);
    }, 1500);
  };

  const missing: string[] = [];
  if (!draft.city.trim()) missing.push("Job site city");
  if (!draft.startDate) missing.push("Start date");
  if (draft.payMin <= 0) missing.push("Hourly pay");

  const submit = () => {
    setTouched(true);
    if (missing.length) {
      toast(`Still need: ${missing.join(", ")}`);
      return;
    }
    const payload: Omit<Role, "id" | "status" | "openedDate"> = {
      title: draft.title,
      trade: "Electrician",
      licenseType: draft.licenseType,
      projectType: draft.projectType,
      city: draft.city.trim(),
      county: draft.county.trim() || CITY_COUNTY[draft.city.trim()] || "Unknown",
      hiresNeeded: draft.hiresNeeded,
      payMin: draft.payMin,
      payMax: Math.max(draft.payMax, draft.payMin),
      perDiem: draft.perDiem,
      startDate: draft.startDate,
      durationMonths: draft.durationMonths,
      overtimeExpected: draft.overtimeExpected,
      overtimeHours: draft.overtimeExpected ? draft.overtimeHours : 0,
      travelRadius: draft.travelRadius,
      requirements: draft.requirements,
      urgency: draft.urgency,
      feePercent: company.defaultFeePercent,
    };
    const roleId = addRole(payload);
    setSubmitted({ draft, roleId });
  };

  if (submitted) {
    return <Sourcing draft={submitted.draft} roleId={submitted.roleId} />;
  }

  return (
    <div>
      <PageHead
        title="Request a hire"
        sub="Tell us who you need. We find licensed hands and bring you the ones who are interested."
      />

      <div className="lg:grid lg:grid-cols-[1fr_19rem] lg:items-start lg:gap-6">
        <div className="space-y-4">
          {/* Describe box */}
          <section className="rounded-lg border-2 border-ink-900 bg-surface-raised p-4 shadow-card sm:p-5">
            <h2 className="font-head text-2xl font-bold uppercase tracking-tight text-ink-900">
              Describe who you need
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Plain words are fine. We will fill in the form below.
            </p>
            <Textarea
              className="mt-3"
              rows={3}
              value={describe}
              onChange={(e) => setDescribe(e.target.value)}
              placeholder={EXAMPLE}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button onClick={runFill} disabled={filling} size="lg" className="sm:w-auto">
                {filling ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Reading it
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    Fill form with AI
                  </>
                )}
              </Button>
              {!describe.trim() && (
                <button
                  type="button"
                  onClick={() => setDescribe(EXAMPLE)}
                  className="text-left text-sm font-semibold text-safety-dark underline underline-offset-2"
                >
                  Use the example
                </button>
              )}
            </div>
            {filled.length > 0 && (
              <div className="mt-3 animate-pop-in rounded-md bg-ok-soft p-3">
                <p className="text-sm font-semibold text-ok">
                  Filled in {filled.length} {filled.length === 1 ? "thing" : "things"}. Check it
                  over before you send.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {filled.map((f) => (
                    <Badge key={f} variant="ok">
                      <Check className="h-3 w-3" />
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Fee estimate on phones sits right under the describe box */}
          <div className="lg:hidden">
            <FeePanel draft={draft} />
          </div>

          <Section step={1} title="The work">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trade" hint="More trades are on the way">
                <Select value={draft.trade} onValueChange={() => undefined}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADES.map((t) => (
                      <SelectItem key={t.value} value={t.value} disabled={!t.available}>
                        {t.value}
                        {!t.available && " (coming soon)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Texas license required">
                <Select
                  value={draft.licenseType}
                  onValueChange={(v) => set("licenseType", v as LicenseType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_TYPES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Role">
                <Select value={draft.title} onValueChange={(v) => set("title", v as RoleTitle)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_TITLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Number of hires" htmlFor="hires">
                <Input
                  id="hires"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={99}
                  className="gh-num"
                  value={draft.hiresNeeded}
                  onChange={(e) => set("hiresNeeded", clamp(Number(e.target.value) || 1, 1, 99))}
                />
              </Field>

              <Field label="Project type" className="sm:col-span-2">
                <Select
                  value={draft.projectType}
                  onValueChange={(v) => set("projectType", v as ProjectType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Section>

          <Section step={2} title="Where and when">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job site city" htmlFor="city">
                <Input
                  id="city"
                  value={draft.city}
                  placeholder="Abilene"
                  className={cn(touched && !draft.city.trim() && "border-bad")}
                  onChange={(e) => {
                    const city = e.target.value;
                    const match = Object.keys(CITY_COUNTY).find(
                      (c) => c.toLowerCase() === city.trim().toLowerCase(),
                    );
                    setDraft((d) => ({
                      ...d,
                      city,
                      county: match ? CITY_COUNTY[match] : d.county,
                    }));
                  }}
                />
              </Field>
              <Field label="County" htmlFor="county">
                <Input
                  id="county"
                  value={draft.county}
                  placeholder="Taylor"
                  onChange={(e) => set("county", e.target.value)}
                />
              </Field>
              <Field label="Start date" htmlFor="start">
                <Input
                  id="start"
                  type="date"
                  className={cn("gh-num", touched && !draft.startDate && "border-bad")}
                  value={draft.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </Field>
              <Field label="Expected duration" htmlFor="duration" hint="In months">
                <Input
                  id="duration"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={60}
                  className="gh-num"
                  value={draft.durationMonths}
                  onChange={(e) =>
                    set("durationMonths", clamp(Number(e.target.value) || 1, 1, 60))
                  }
                />
              </Field>
            </div>
          </Section>

          <Section step={3} title="Pay">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hourly pay, low end" htmlFor="paymin">
                <Input
                  id="paymin"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="gh-num"
                  value={draft.payMin}
                  onChange={(e) => set("payMin", clamp(Number(e.target.value) || 0, 0, 200))}
                />
              </Field>
              <Field label="Hourly pay, high end" htmlFor="paymax">
                <Input
                  id="paymax"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="gh-num"
                  value={draft.payMax}
                  onChange={(e) => set("payMax", clamp(Number(e.target.value) || 0, 0, 200))}
                />
              </Field>
              <Field label="Overtime expected">
                <Segmented
                  value={draft.overtimeExpected ? "yes" : "no"}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                  onChange={(v) => set("overtimeExpected", v === "yes")}
                />
              </Field>
              <Field
                label="Hours per week"
                htmlFor="othours"
                hint={draft.overtimeExpected ? "Including overtime" : "No overtime expected"}
              >
                <Input
                  id="othours"
                  type="number"
                  inputMode="numeric"
                  min={40}
                  max={84}
                  className="gh-num"
                  disabled={!draft.overtimeExpected}
                  value={draft.overtimeExpected ? draft.overtimeHours : 40}
                  onChange={(e) => set("overtimeHours", clamp(Number(e.target.value) || 40, 40, 84))}
                />
              </Field>
              <Field label="Per diem per day" htmlFor="perdiem" className="sm:col-span-2">
                <Input
                  id="perdiem"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={300}
                  className="gh-num"
                  value={draft.perDiem}
                  onChange={(e) => set("perDiem", clamp(Number(e.target.value) || 0, 0, 300))}
                />
              </Field>
            </div>
          </Section>

          <Section step={4} title="Who to consider">
            <div className="space-y-4">
              <Field
                label="Willing to consider workers who travel"
                hint="A wider range usually means more interested hands"
              >
                <Select
                  value={draft.travelRadius}
                  onValueChange={(v) => set("travelRadius", v as TravelRadius)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_RADIUS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div>
                <Label className="mb-1.5 block">Requirements</Label>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {REQUIREMENTS.map((req) => {
                    const on = draft.requirements.includes(req);
                    return (
                      <label
                        key={req}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border-2 px-3",
                          on
                            ? "border-ink-900 bg-surface-sunk"
                            : "border-surface-line bg-surface-raised",
                        )}
                      >
                        <Checkbox
                          checked={on}
                          onCheckedChange={(v) =>
                            set(
                              "requirements",
                              v
                                ? [...draft.requirements, req]
                                : draft.requirements.filter((r) => r !== req),
                            )
                          }
                        />
                        <span className="text-base font-semibold text-ink-800">{req}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Field label="Urgency">
                <Segmented
                  value={draft.urgency}
                  options={URGENCIES.map((u) => ({ value: u, label: u }))}
                  onChange={(v) => set("urgency", v as Urgency)}
                />
                <p className="mt-1.5 text-xs text-ink-400">
                  {draft.urgency === "Standard" && "We email matches over the next few days."}
                  {draft.urgency === "Urgent" && "We email every match today and follow up sooner."}
                  {draft.urgency === "Critical" &&
                    "We email every match today and call the strongest ones."}
                </p>
              </Field>
            </div>
          </Section>

          {touched && missing.length > 0 && (
            <div className="rounded-md border-2 border-bad bg-bad-soft p-3 text-sm font-semibold text-bad">
              Still need: {missing.join(", ")}
            </div>
          )}

          <Button size="lg" className="w-full" onClick={submit}>
            Send this request
          </Button>
          <p className="pb-2 text-center text-xs text-ink-400">
            No cost to send. You only pay a fee when a hire starts work.
          </p>
        </div>

        {/* Fee estimate, desktop side rail */}
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <FeePanel draft={draft} />
        </aside>
      </div>
    </div>
  );
}
