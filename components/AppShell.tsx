import { school } from "@/lib/school";
import Link from "next/link";

export function AppShell({ children, athleteId }: { children: React.ReactNode; athleteId?: string }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/15 bg-tcps-maroon text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="TCPS home">
            <span className="grid size-10 place-items-center rounded-xl border-2 border-tcps-gold font-black">TC</span>
            <span>
              <span className="block text-sm font-black tracking-wide">TC PERFORMANCE SYSTEM</span>
              <span className="block text-xs text-white/70">{school.name} · {school.program}</span>
            </span>
          </Link>
          <Link href="/coach" className="rounded-lg border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white/10">Coach view</Link>
        </div>
      </header>
      {athleteId ? (
        <div className="border-b border-black/10 bg-white/80">
          <div className="mx-auto max-w-6xl px-4 py-2 text-sm font-semibold text-black/65 sm:px-6">Athlete: <span className="text-tcps-maroon">{athleteId}</span></div>
        </div>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-center text-xs text-black/55 sm:px-6">
        People make you powerful. Systems make people perform. · Coaching decision support only; not medical advice.
      </footer>
    </div>
  );
}
