import type { TrafficLight } from "@/lib/types";

const style: Record<TrafficLight, string> = {
  green: "border-emerald-600/25 bg-emerald-50 text-emerald-800",
  yellow: "border-amber-600/25 bg-amber-50 text-amber-900",
  red: "border-red-600/25 bg-red-50 text-red-800"
};

export function StatusBadge({ light }: { light: TrafficLight }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${style[light]}`}>{light}</span>;
}
