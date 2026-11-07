export type SheetEvent = "readiness" | "recovery" | "reflection";

// Sends an athlete submission to the coach's Google Sheet via the server route.
export async function syncToSheet(event: SheetEvent, athleteId: string, data: object): Promise<boolean> {
  try {
    const response = await fetch("/api/sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, athleteId, data })
    });
    return response.ok;
  } catch {
    return false;
  }
}
