import { AppShell } from "@/components/AppShell";

const sheetUrl = process.env.NEXT_PUBLIC_COACH_SHEET_URL;

export default function CoachPage() {
  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Coach view</p><h1 className="mt-2 text-3xl font-black text-tcps-maroon">Coach Google Sheet</h1><p className="mt-2 text-sm text-black/60">Athlete sign-ins land here automatically. Set the Coach decision column to Modified, Hold, or Refer to override a plan.</p></div>
        {sheetUrl ? <a href={sheetUrl} target="_blank" rel="noreferrer" className="btn-primary">Open in Google Sheets</a> : null}
      </div>
      {sheetUrl ? <iframe title="Coach Google Sheet" src={sheetUrl} className="mt-6 h-[75vh] w-full rounded-2xl border border-black/10 bg-white shadow-card" /> : <div className="card mt-6">Set <code>NEXT_PUBLIC_COACH_SHEET_URL</code> to the Google Sheet link (see google-sheet/Code.gs for setup).</div>}
      <aside className="mt-5 rounded-2xl border border-tcps-gold/60 bg-[#fffaf0] p-4 text-sm leading-6"><strong>Pilot privacy:</strong> use non-sensitive athlete codes and restrict sheet sharing to coaches.</aside>
    </AppShell>
  );
}
