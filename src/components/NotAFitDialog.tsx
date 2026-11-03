import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NOT_A_FIT_REASONS, type Candidate } from "@/data/types";
import { useStore } from "@/store/AppStore";

export function NotAFitDialog({
  candidate,
  open,
  onOpenChange,
}: {
  candidate: Candidate;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { markNotAFit, toast } = useStore();
  const [reason, setReason] = React.useState(NOT_A_FIT_REASONS[0]);
  const name = `${candidate.firstName} ${candidate.lastInitial}.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Not a fit</DialogTitle>
          <DialogDescription>
            Tell us why {name} is not right and we will use it to pick better matches for this
            role.
          </DialogDescription>
        </DialogHeader>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NOT_A_FIT_REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              markNotAFit(candidate.id, reason);
              toast(`${name} marked not a fit`);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
