import * as React from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  DollarSign,
  Lock,
  Mail,
  Phone,
  Quote,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LicenseBadge, MatchScore } from "@/components/bits";
import { NotAFitDialog } from "@/components/NotAFitDialog";
import { nextStep } from "@/components/CandidateCard";
import { STAGE_LABELS, type Candidate, type Role } from "@/data/types";
import { fmtDate, fmtMoney, fmtRate } from "@/lib/format";
import { useStore } from "@/store/AppStore";

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-surface-line bg-surface-raised p-3">
      <div className="gh-label flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-ink-900">{value}</div>
    </div>
  );
}

function IntroduceBlock({
  candidate,
  role,
  open,
  setOpen,
}: {
  candidate: Candidate;
  role: Role;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const { introduceCandidate, toast } = useStore();
  const name = `${candidate.firstName} ${candidate.lastInitial}.`;

  if (candidate.contactRevealed) {
    return (
      <div className="rounded-md border border-ok/25 bg-ok-soft p-4">
        <div className="gh-label flex items-center gap-1.5 text-ok">
          <BadgeCheck className="h-4 w-4" />
          Introduced. Here is how to reach them
        </div>
        <div className="mt-3 space-y-2">
          <a
            href={`tel:${candidate.phone.replace(/[^0-9]/g, "")}`}
            className="flex min-h-12 items-center gap-3 rounded-md border border-surface-line bg-surface-raised px-3 font-mono text-base font-semibold text-ink-900"
          >
            <Phone className="h-4 w-4 text-ink-400" />
            {candidate.phone}
          </a>
          <a
            href={`mailto:${candidate.email}`}
            className="flex min-h-12 items-center gap-3 overflow-hidden rounded-md border border-surface-line bg-surface-raised px-3 font-mono text-sm font-semibold text-ink-900"
          >
            <Mail className="h-4 w-4 shrink-0 text-ink-400" />
            <span className="truncate">{candidate.email}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border-2 border-dashed border-surface-line bg-surface-sunk p-4">
      <div className="gh-label flex items-center gap-1.5">
        <Lock className="h-4 w-4" />
        Contact info hidden
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Phone and email stay hidden until you ask for an introduction. We will pass your name and
        number to {candidate.firstName} and put them in your interviewing list.
      </p>
      <Button className="mt-3 w-full" size="lg" onClick={() => setOpen(true)}>
        Introduce me
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Introduce me to {name}</DialogTitle>
            <DialogDescription>
              This starts a 12 month fee window on {name}
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2.5 text-sm leading-relaxed text-ink-700">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-safety" />
              We send your name, company and phone number to {candidate.firstName}, and show you
              their phone and email.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-safety" />
              If you hire {candidate.firstName} within 12 months of this introduction, the
              placement fee applies.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-safety" />
              Fee for this role is {role.feePercent}% of first year pay, due when they start work.
              Nothing is owed if they never start.
            </li>
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Not yet
            </Button>
            <Button
              onClick={() => {
                introduceCandidate(candidate.id);
                setOpen(false);
                toast(`${name} introduced. Contact info is open.`);
              }}
            >
              Yes, introduce me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CandidateDrawer() {
  const {
    openCandidateId,
    closeCandidate,
    candidates,
    roles,
    setNotes,
    markReviewed,
    moveCandidate,
    toast,
  } = useStore();
  const candidate = candidates.find((c) => c.id === openCandidateId);
  const [notFitOpen, setNotFitOpen] = React.useState(false);
  const [introOpen, setIntroOpen] = React.useState(false);
  const [draftNotes, setDraftNotes] = React.useState("");

  React.useEffect(() => {
    if (candidate) {
      setDraftNotes(candidate.notes);
      setIntroOpen(false);
      if (!candidate.reviewed) markReviewed(candidate.id);
    }
  }, [openCandidateId]);

  if (!candidate) return null;
  const role = roles.find((r) => r.id === candidate.roleId);
  if (!role) return null;
  const name = `${candidate.firstName} ${candidate.lastInitial}.`;
  const step = nextStep(candidate.stage);
  const stageLabel =
    candidate.stage === "not_a_fit" ? "Not a fit" : STAGE_LABELS[candidate.stage];

  return (
    <Sheet open onOpenChange={(v) => !v && closeCandidate()}>
      <SheetContent className="overflow-y-auto">
        {/* Header */}
        <div className="bg-ink-900 px-4 pb-4 pt-5 sm:px-5">
          <SheetTitle className="font-head text-3xl font-bold uppercase leading-none tracking-tight text-white">
            {name}
          </SheetTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <LicenseBadge type={candidate.licenseType} />
            <Badge variant="safety">{stageLabel}</Badge>
            <span className="text-sm text-white/70">
              Licensed since <span className="gh-num">{candidate.licensedSince}</span>
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <Link
              to={`/roles/${role.id}`}
              onClick={closeCandidate}
              className="text-sm font-semibold text-safety underline underline-offset-2"
            >
              {role.title} in {role.city}
            </Link>
            <div className="rounded bg-white/10 px-2.5 py-1.5">
              <MatchScore score={candidate.matchScore} size="sm" tone="dark" />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {/* License panel */}
          <section className="rounded-lg border border-surface-line bg-surface-raised p-4">
            <h4 className="gh-label mb-3">Texas license</h4>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-ink-400">Type</dt>
                <dd className="font-semibold text-ink-900">{candidate.licenseType}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Number</dt>
                <dd className="gh-num font-semibold text-ink-900">{candidate.licenseNumber}</dd>
              </div>
              <div>
                <dt className="text-ink-400">Expires</dt>
                <dd className="gh-num font-semibold text-ink-900">
                  {fmtDate(candidate.licenseExpires)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-400">Licensed since</dt>
                <dd className="gh-num font-semibold text-ink-900">{candidate.licensedSince}</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-start gap-2 rounded-md bg-ok-soft p-2.5 text-xs font-semibold text-ok">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              Verified with Texas license records on {fmtDate(candidate.verifiedDate)}
            </div>
          </section>

          {/* Their reply */}
          {candidate.replyMessage && (
            <section>
              <h4 className="gh-label mb-2">What they wrote back</h4>
              <blockquote className="relative rounded-lg border-l-4 border-safety bg-safety-soft p-4 pl-10 text-base leading-relaxed text-ink-800">
                <Quote className="absolute left-3 top-3.5 h-4 w-4 text-safety" />
                {candidate.replyMessage}
                {candidate.repliedDate && (
                  <footer className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {fmtDate(candidate.repliedDate)}
                  </footer>
                )}
              </blockquote>
            </section>
          )}

          {/* Facts */}
          <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Fact
              icon={CalendarDays}
              label="Can start"
              value={
                candidate.availabilityDate ? fmtDate(candidate.availabilityDate) : "Not said yet"
              }
            />
            <Fact
              icon={DollarSign}
              label="Pay they want"
              value={candidate.preferredPay ? fmtRate(candidate.preferredPay) : "Not said yet"}
            />
            <Fact
              icon={Truck}
              label="Travel"
              value={
                candidate.willingToTravel
                  ? `Yes, ${candidate.distanceMiles} mi away`
                  : `No, ${candidate.distanceMiles} mi away`
              }
            />
          </section>

          {/* Contact */}
          <IntroduceBlock
            candidate={candidate}
            role={role}
            open={introOpen}
            setOpen={setIntroOpen}
          />

          {/* Notes */}
          <section>
            <h4 className="gh-label mb-2">Your notes</h4>
            <Textarea
              value={draftNotes}
              placeholder="Anything you want to remember about this hand"
              onChange={(e) => setDraftNotes(e.target.value)}
              onBlur={() => setNotes(candidate.id, draftNotes)}
            />
          </section>

          <Separator />

          {/* Timeline */}
          <section>
            <h4 className="gh-label mb-3">What has happened</h4>
            <ol className="space-y-0">
              {candidate.timeline.map((ev, i) => (
                <li key={`${ev.label}-${i}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-safety" />
                    {i < candidate.timeline.length - 1 && (
                      <span className="w-px flex-1 bg-surface-line" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="text-sm font-semibold text-ink-900">{ev.label}</div>
                    <div className="gh-num text-xs text-ink-400">{fmtDate(ev.date)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sticky actions */}
        <div className="sticky bottom-0 mt-auto flex gap-2 border-t border-surface-line bg-surface-raised p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {!candidate.contactRevealed && candidate.stage !== "not_a_fit" ? (
            <Button className="flex-1" size="lg" onClick={() => setIntroOpen(true)}>
              Introduce me
            </Button>
          ) : step ? (
            <Button
              className="flex-1"
              size="lg"
              onClick={() => {
                moveCandidate(candidate.id, step.stage);
                toast(`${name}: ${step.label.toLowerCase()}`);
              }}
            >
              {step.label}
            </Button>
          ) : (
            <Button className="flex-1" size="lg" variant="outline" onClick={closeCandidate}>
              Close
            </Button>
          )}
          {candidate.stage !== "not_a_fit" && candidate.stage !== "started" && (
            <Button size="lg" variant="danger" onClick={() => setNotFitOpen(true)}>
              Not a fit
            </Button>
          )}
        </div>

        <NotAFitDialog candidate={candidate} open={notFitOpen} onOpenChange={setNotFitOpen} />
      </SheetContent>
    </Sheet>
  );
}
