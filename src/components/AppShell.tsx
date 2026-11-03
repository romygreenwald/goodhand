import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ClipboardList,
  Home,
  Mail,
  MoreHorizontal,
  Plus,
  Receipt,
  Settings as SettingsIcon,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SampleDataBanner, Wordmark } from "@/components/bits";
import { CandidateDrawer } from "@/components/CandidateDrawer";
import { useStore } from "@/store/AppStore";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/roles", label: "Roles", icon: ClipboardList },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/outreach", label: "Outreach", icon: Mail },
  { to: "/billing", label: "Hires and billing", icon: Receipt },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const MORE_NAV = NAV.filter((n) => ["/outreach", "/billing", "/settings"].includes(n.to));

function Sidebar() {
  const { company } = useStore();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-ink-900 lg:flex">
      <div className="px-5 pb-5 pt-6">
        <Link to="/" className="block">
          <Wordmark />
        </Link>
        <p className="mt-2 font-head text-sm uppercase tracking-[0.14em] text-safety">
          Hire a good hand
        </p>
      </div>
      <nav className="flex-1 space-y-0.5 px-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex min-h-11 items-center gap-3 rounded-md border-l-[3px] px-3 font-head text-lg font-semibold uppercase tracking-wide transition-colors",
                isActive
                  ? "border-safety bg-white/10 text-white"
                  : "border-transparent text-ink-300 hover:bg-white/5 hover:text-white",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-3 rounded-md bg-white/5 p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-safety font-head text-base font-bold text-ink-900">
            {company.logoInitials}
          </span>
          <span className="text-xs font-semibold leading-snug text-white">{company.name}</span>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const location = useLocation();
  const isMore = MORE_NAV.some((n) => location.pathname.startsWith(n.to));
  const tab = (to: string, label: string, Icon: typeof Home) => (
    <NavLink
      key={to}
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold",
          isActive ? "text-safety" : "text-white/60",
        )
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-white/10 bg-ink-900 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {tab("/", "Home", Home)}
        {tab("/roles", "Roles", ClipboardList)}
        <Link
          to="/request"
          className="relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-bold text-ink-900"
          aria-label="Request a hire"
        >
          <span className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-ink-900 bg-safety shadow-lift">
            <Plus className="h-7 w-7 stroke-[3]" />
          </span>
          <span className="mt-7 text-safety">Request</span>
        </Link>
        {tab("/candidates", "Candidates", Users)}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold",
            isMore ? "text-safety" : "text-white/60",
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
          More
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="p-4 pb-8">
          <SheetTitle className="gh-label mb-3">More</SheetTitle>
          <div className="space-y-2">
            {MORE_NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMoreOpen(false)}
                className="flex min-h-14 items-center gap-3 rounded-md border border-surface-line bg-surface-raised px-4 font-head text-xl font-semibold uppercase tracking-wide text-ink-900"
              >
                <Icon className="h-5 w-5 text-ink-400" />
                {label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Toasts() {
  const { toasts } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-pop-in rounded-md bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lift"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { closeCandidate } = useStore();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    closeCandidate();
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-surface">
      <Sidebar />
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30">
          <SampleDataBanner />
          <div className="flex items-center justify-between bg-ink-900 px-4 py-2.5 lg:hidden">
            <Link to="/">
              <Wordmark />
            </Link>
            <span className="font-head text-xs uppercase tracking-[0.14em] text-safety">
              Hire a good hand
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>
      <MobileNav />
      <CandidateDrawer />
      <Toasts />
    </div>
  );
}
