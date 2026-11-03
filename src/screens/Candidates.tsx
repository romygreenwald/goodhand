import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CandidateCard } from "@/components/CandidateCard";
import { EmptyNote, PageHead } from "@/components/bits";
import { BOARD_STAGES, STAGES, STAGE_LABELS } from "@/data/types";
import { useStore } from "@/store/AppStore";

export default function Candidates() {
  const { candidates, roles } = useStore();
  const [roleId, setRoleId] = React.useState("all");
  const [stage, setStage] = React.useState("waiting");
  const [q, setQ] = React.useState("");

  const list = candidates
    .filter((c) => (roleId === "all" ? true : c.roleId === roleId))
    .filter((c) => {
      if (stage === "all") return true;
      if (stage === "waiting") return BOARD_STAGES.includes(c.stage as never);
      if (stage === "not_a_fit") return c.stage === "not_a_fit";
      return c.stage === stage;
    })
    .filter((c) =>
      q.trim()
        ? `${c.firstName} ${c.lastInitial} ${c.county} ${c.city}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())
        : true,
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div>
      <PageHead
        title="Candidates"
        sub="Everyone we have found for your roles, strongest match first"
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <div>
          <label className="gh-label mb-1 block" htmlFor="c-role">
            Role
          </label>
          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger id="c-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title}, {r.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="gh-label mb-1 block" htmlFor="c-stage">
            Stage
          </label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger id="c-stage">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waiting">Interested and further</SelectItem>
              <SelectItem value="all">Every stage</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STAGE_LABELS[s]}
                </SelectItem>
              ))}
              <SelectItem value="not_a_fit">Not a fit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="gh-label mb-1 block" htmlFor="c-search">
            Find a name
          </label>
          <Input
            id="c-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or county"
          />
        </div>
      </div>

      <p className="mb-3 text-sm text-ink-500">
        <span className="gh-num font-semibold">{list.length}</span>{" "}
        {list.length === 1 ? "person" : "people"}
      </p>

      {list.length === 0 ? (
        <EmptyNote>Nobody matches those filters yet.</EmptyNote>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
