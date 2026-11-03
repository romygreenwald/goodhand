import * as React from "react";
import { MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LicenseBadge, MatchScore, PlaceLine } from "@/components/bits";
import { NotAFitDialog } from "@/components/NotAFitDialog";
import { type Candidate, type Stage } from "@/data/types";
import { employerLine, fmtDateShort } from "@/lib/format";
import { useStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

export function nextStep(stage: Candidate["stage"]): { label: string; stage: Stage } | null {
  switch (stage) {
    case "introduced":
      return { label: "Move to interviewing", stage: "interviewing" };
    case "interviewing":
      return { label: "Mark hired", stage: "hired" };
    case "hired":
      return { label: "Mark started", stage: "started" };
    default:
      return null;
  }
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { openCandidate, moveCandidate, toast } = useStore();
  const [notFitOpen, setNotFitOpen] = React.useState(false);
  const name = `${candidate.firstName} ${candidate.lastInitial}.`;
  const step = nextStep(candidate.stage);
  const isNew = candidate.stage === "interested" && !candidate.reviewed;

  return (
    <div
      className={cn(
        "rounded-lg border bg-surface-raised p-3.5 shadow-card",
        isNew ? "border-safety" : "border-surface-line",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-head text-xl font-semibold leading-none text-ink-900">{name}</h3>
            {isNew && <Badge variant="safety">New</Badge>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <LicenseBadge type={candidate.licenseType} />
            <span className="text-xs text-ink-500">
              Licensed since <span className="gh-num">{candidate.licensedSince}</span>
            </span>
          </div>
        </div>
        <MatchScore score={candidate.matchScore} />
      </div>

      <div className="mt-2.5 space-y-1.5">
        <PlaceLine
          county={candidate.county}
          miles={candidate.distanceMiles}
          travel={candidate.willingToTravel}
        />
        <p className="text-sm text-ink-500">{employerLine(candidate.employerType)}</p>
        {candidate.repliedDate && (
          <p className="flex items-center gap-1.5 text-sm text-ink-500">
            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0 text-ink-400" />
            Replied {fmtDateShort(candidate.repliedDate)}
          </p>
        )}
        {candidate.stage === "not_a_fit" && candidate.notAFitReason && (
          <p className="text-sm font-semibold text-bad">Not a fit: {candidate.notAFitReason}</p>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={candidate.stage === "interested" ? "primary" : "outline"}
          onClick={() => openCandidate(candidate.id)}
        >
          Review
        </Button>
        {step && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              moveCandidate(candidate.id, step.stage);
              toast(`${name}: ${step.label.toLowerCase()}`);
            }}
          >
            {step.label}
          </Button>
        )}
        {candidate.stage !== "not_a_fit" && candidate.stage !== "started" && (
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => setNotFitOpen(true)}
          >
            Not a fit
          </Button>
        )}
      </div>

      <NotAFitDialog candidate={candidate} open={notFitOpen} onOpenChange={setNotFitOpen} />
    </div>
  );
}
