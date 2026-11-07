import Link from "next/link";

const steps = [
  ["readiness", "Readiness"],
  ["training", "Train"],
  ["recovery", "Recover"],
  ["reflect", "Reflect"]
] as const;

export function FlowNav({ athleteId, active }: { athleteId: string; active: string }) {
  return (
    <nav aria-label="Athlete workflow" className="mb-6 grid grid-cols-4 gap-1 rounded-2xl border border-black/10 bg-white p-1.5 shadow-sm">
      {steps.map(([href, label], index) => (
        <Link key={href} href={`/dashboard/${athleteId}/${href}`} className={`rounded-xl px-1 py-2 text-center text-[11px] font-black sm:text-sm ${active === href ? "bg-tcps-maroon text-white" : "text-black/55 hover:bg-black/5"}`}>
          <span className="block text-[10px] opacity-70">{index + 1}</span>{label}
        </Link>
      ))}
    </nav>
  );
}
