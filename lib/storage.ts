import { school } from "@/lib/school";
import type { AthleteRecord } from "@/lib/types";

const prefix = `tcps-${school.id}-record:`;
const indexKey = `tcps-${school.id}-athletes`;

export function normalizeAthleteId(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "athlete-1";
}

export function loadRecord(athleteId: string): AthleteRecord {
  if (typeof window === "undefined") return { athleteId };
  const raw = window.localStorage.getItem(prefix + athleteId);
  if (!raw) return { athleteId };
  try {
    return { athleteId, ...JSON.parse(raw) } as AthleteRecord;
  } catch {
    return { athleteId };
  }
}

export function saveRecord(record: AthleteRecord) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(prefix + record.athleteId, JSON.stringify(record));
  const ids = listAthleteIds();
  if (!ids.includes(record.athleteId)) window.localStorage.setItem(indexKey, JSON.stringify([...ids, record.athleteId]));
}

export function listAthleteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(indexKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function listRecords(): AthleteRecord[] {
  return listAthleteIds().map(loadRecord);
}

export function clearRecord(athleteId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(prefix + athleteId);
  window.localStorage.setItem(indexKey, JSON.stringify(listAthleteIds().filter((id) => id !== athleteId)));
}
