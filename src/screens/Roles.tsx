import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyNote, PageHead, StatusBadge } from "@/components/bits";
import { PROJECT_TYPES, ROLE_STATUSES } from "@/data/types";
import { fmtMoney } from "@/lib/format";
import { useStore } from "@/store/AppStore";

export default function Roles() {
  const { roles, roleStats } = useStore();
  const [status, setStatus] = React.useState("all");
  const [project, setProject] = React.useState("all");

  const filtered = roles.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (project === "all" || r.projectType === project),
  );

  return (
    <div>
      <PageHead title="Roles" sub={`${roles.length} roles, newest first`}>
        <Button asChild>
          <Link to="/request">Request a hire</Link>
        </Button>
      </PageHead>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:max-w-md">
        <div>
          <label className="gh-label mb-1 block" htmlFor="role-status">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="role-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ROLE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="gh-label mb-1 block" htmlFor="role-project">
            Project
          </label>
          <Select value={project} onValueChange={setProject}>
            <SelectTrigger id="role-project">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {PROJECT_TYPES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 && <EmptyNote>No roles match those filters.</EmptyNote>}

      {/* Phone: cards */}
      <ul className="space-y-2 lg:hidden">
        {filtered.map((role) => {
          const stats = roleStats(role.id);
          return (
            <li key={role.id}>
              <Link
                to={`/roles/${role.id}`}
                className="block rounded-lg border border-surface-line bg-surface-raised p-3.5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-head text-xl font-semibold leading-tight text-ink-900">
                      {role.title}
                    </div>
                    <div className="mt-0.5 text-sm text-ink-500">
                      {role.city}, {role.county} County
                    </div>
                  </div>
                  <StatusBadge status={role.status} />
                </div>
                <dl className="mt-3 grid grid-cols-4 gap-2 border-t border-surface-line pt-3 text-center">
                  {[
                    ["Needed", role.hiresNeeded],
                    ["Contacted", stats.contacted],
                    ["Interested", stats.interestedNow],
                    ["Hired", stats.filled],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <dt className="gh-label text-[10px]">{label}</dt>
                      <dd className="gh-num font-head text-2xl font-bold leading-none text-ink-900">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex items-center justify-between text-sm text-ink-500">
                  <span className="gh-num">
                    ${role.payMin} to ${role.payMax}/hr
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="gh-num">{stats.daysOpen}</span> days open
                    <ChevronRight className="h-4 w-4 text-ink-300" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-lg border border-surface-line bg-surface-raised shadow-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Needed</TableHead>
              <TableHead className="text-right">Contacted</TableHead>
              <TableHead className="text-right">Interested</TableHead>
              <TableHead className="text-right">Hired</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Days open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((role) => {
              const stats = roleStats(role.id);
              return (
                <TableRow key={role.id} className="hover:bg-surface">
                  <TableCell>
                    <Link
                      to={`/roles/${role.id}`}
                      className="font-head text-lg font-semibold text-ink-900 hover:text-safety-dark"
                    >
                      {role.title}
                    </Link>
                    <div className="gh-num text-xs text-ink-400">
                      ${role.payMin} to ${role.payMax}/hr, ${role.perDiem}/day per diem
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {role.city}
                    <div className="text-xs text-ink-400">{role.county} County</div>
                  </TableCell>
                  <TableCell className="gh-num text-right">{role.hiresNeeded}</TableCell>
                  <TableCell className="gh-num text-right">{stats.contacted}</TableCell>
                  <TableCell className="gh-num text-right">
                    {stats.interestedNow > 0 ? (
                      <Badge variant="safety">{stats.interestedNow}</Badge>
                    ) : (
                      <span className="text-ink-300">0</span>
                    )}
                  </TableCell>
                  <TableCell className="gh-num text-right">
                    {stats.filled} of {role.hiresNeeded}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={role.status} />
                  </TableCell>
                  <TableCell className="gh-num text-right">{stats.daysOpen}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
