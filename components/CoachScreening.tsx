"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { loadRecord, normalizeAthleteId, saveRecord } from "@/lib/storage";
import { movementOptions } from "@/lib/movement-assessment";
import { createTrainingPlan } from "@/lib/training-engine";
import type { AiMovementScreening, CoachScreening, MovementPriority, ParticipationStatus } from "@/lib/types";

const priorities: { value: MovementPriority; label: string }[] = [
  { value: "foot-ankle", label: "Foot / ankle" },
  { value: "knee", label: "Knee" },
  { value: "hip", label: "Hip" },
  { value: "trunk", label: "Trunk" },
  { value: "landing", label: "Landing" },
  { value: "general", label: "General" }
];

const ratingLabels = [
  ["control", "Control"],
  ["alignment", "Alignment"],
  ["balance", "Balance"],
  ["usableRange", "Usable range"]
] as const;

function canvasToJpeg(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not process the media.");
  return canvas.toDataURL("image/jpeg", 0.65);
}

async function imageToJpeg(file: File) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  return canvasToJpeg(canvas);
}

async function videoToJpegs(file: File) {
  const video = document.createElement("video");
  const url = URL.createObjectURL(file);
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("The video could not be read."));
      video.src = url;
    });
    if (!Number.isFinite(video.duration) || video.duration < 0.3 || video.duration > 30) {
      throw new Error("Use a video clip between 0.3 and 30 seconds.");
    }

    const images: string[] = [];
    for (const fraction of [0.2, 0.5, 0.8]) {
      await new Promise<void>((resolve, reject) => {
        video.onseeked = () => resolve();
        video.onerror = () => reject(new Error("A video frame could not be read."));
        video.currentTime = Math.min(video.duration - 0.05, Math.max(0, video.duration * fraction));
      });
      const scale = Math.min(1, 640 / Math.max(video.videoWidth, video.videoHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      images.push(canvasToJpeg(canvas));
    }
    return images;
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

async function mediaToImages(files: File[]) {
  if (files.length === 0 || files.length > 4) throw new Error("Choose one to four photos or a short video.");
  const videos = files.filter((file) => file.type.startsWith("video/"));
  if (videos.length > 1) throw new Error("Choose one video clip at a time.");
  if (files.some((file) => file.size > 30 * 1024 * 1024)) throw new Error("Each media file must be 30 MB or smaller.");

  const images: string[] = [];
  for (const file of files) {
    if (["video/mp4", "video/webm"].includes(file.type)) {
      images.push(...await videoToJpegs(file));
    } else if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      images.push(await imageToJpeg(file));
    } else {
      throw new Error("Use JPEG, PNG, or WebP photos and MP4 or WebM videos.");
    }
    if (images.length > 4) throw new Error("Use at most four photos or video frames in one screen.");
  }
  return images;
}

function isAiScreening(value: unknown): value is AiMovementScreening {
  if (!value || typeof value !== "object") return false;
  const screening = value as Record<string, unknown>;
  return ["clear", "coach_review", "refer"].includes(String(screening.riskLevel))
    && typeof screening.summary === "string"
    && screening.summary.length <= 1000
    && ["observations", "referralReasons", "nextSteps"].every((key) =>
      Array.isArray(screening[key])
      && (screening[key] as unknown[]).length <= 6
      && (screening[key] as unknown[]).every((item) => typeof item === "string" && item.length <= 500)
    );
}

function saveScreeningRecord(athleteId: string, screening: CoachScreening) {
  const record = loadRecord(athleteId);
  const updated = { ...record, movement: screening.movement, screening };
  if (record.readiness) {
    updated.plan = createTrainingPlan({
      athleteId,
      readinessInput: record.readiness,
      screening,
      coachApproved: screening.coachDecision === "full" || screening.coachDecision === "modified",
      coachName: screening.coachName,
      sessionId: record.plan?.sessionId ?? 1
    });
  }
  saveRecord(updated);
}

export function CoachScreening() {
  const [athleteCode, setAthleteCode] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [movementId, setMovementId] = useState<string>(movementOptions[0].id);
  const [priority, setPriority] = useState<MovementPriority>("general");
  const [ratings, setRatings] = useState({ control: 3, alignment: 3, balance: 3, usableRange: 3 });
  const [notes, setNotes] = useState("");
  const [painReported, setPainReported] = useState(false);
  const [medicalConcern, setMedicalConcern] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [screening, setScreening] = useState<CoachScreening | null>(null);
  const [screenedAthleteId, setScreenedAthleteId] = useState("");
  const [decision, setDecision] = useState<ParticipationStatus | "">("");
  const [coachName, setCoachName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function loadSavedScreening() {
    if (!athleteCode.trim()) {
      setError("Enter an athlete code first.");
      return;
    }
    const athleteId = normalizeAthleteId(athleteCode);
    const saved = loadRecord(athleteId).screening;
    setScreenedAthleteId(saved ? athleteId : "");
    setScreening(saved ?? null);
    setDecision(saved?.coachDecision ?? "");
    setCoachName(saved?.coachName ?? "");
    setError("");
    setNotice(saved ? "Loaded the latest saved screening." : "");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const images = await mediaToImages(mediaFiles);
      const response = await fetch("/api/ai-screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-coach-access-code": accessCode
        },
        body: JSON.stringify({
          movement: movementOptions.find((movement) => movement.id === movementId)?.label ?? movementId,
          ratings,
          notes,
          painReported,
          medicalConcern,
          permissionConfirmed: consentConfirmed,
          images
        })
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "The screening could not be completed.");
      if (!isAiScreening(payload?.result)) throw new Error("The screening returned an invalid result.");

      const athleteId = normalizeAthleteId(athleteCode);
      const now = new Date().toISOString();
      const nextScreening: CoachScreening = {
        movement: {
          movementId,
          ...ratings,
          priority,
          observations: payload.result.observations,
          coachNote: notes,
          createdAt: now
        },
        aiReview: payload.result,
        coachDecision: null,
        coachName: "",
        decisionAt: null
      };
      saveScreeningRecord(athleteId, nextScreening);
      setScreenedAthleteId(athleteId);
      setScreening(nextScreening);
      setDecision("");
      setCoachName("");
      setConsentConfirmed(false);
      setNotice("AI screening saved. Record a coach decision before the training plan can proceed.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The screening could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  function saveCoachDecision() {
    if (!screening || !screenedAthleteId || !decision || !coachName.trim()) return;
    if (screening.aiReview.riskLevel === "refer" && decision !== "hold" && decision !== "refer") return;
    const updated: CoachScreening = {
      ...screening,
      coachDecision: decision,
      coachName: coachName.trim().slice(0, 80),
      decisionAt: new Date().toISOString()
    };
    saveScreeningRecord(screenedAthleteId, updated);
    setScreening(updated);
    setNotice("Coach decision saved. The training plan will use this decision.");
  }

  function updateMedia(event: ChangeEvent<HTMLInputElement>) {
    setMediaFiles(Array.from(event.target.files ?? []));
    setConsentConfirmed(false);
  }

  const allowedDecisions = screening?.aiReview.riskLevel === "refer"
    ? ["hold", "refer"] as const
    : ["full", "modified", "hold", "refer"] as const;

  return (
    <section className="card mt-6 space-y-5">
      <div>
        <p className="eyebrow">Coach screening · steps 2 and 3</p>
        <h2 className="mt-2 text-2xl font-black text-tcps-maroon">AI-assisted movement screen and referral review</h2>
        <p className="mt-2 text-sm leading-6 text-black/65">The AI describes visible movement cues for coach review. It does not diagnose, predict injury, or clear athletes. A plan stays on hold until a coach records a decision.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="screen-athlete">Athlete code</label>
            <div className="flex gap-2">
              <input id="screen-athlete" required maxLength={64} className="field" value={athleteCode} onChange={(event) => setAthleteCode(event.target.value)} placeholder="example: athlete-07" autoComplete="off" />
              <button type="button" className="btn-secondary shrink-0" onClick={loadSavedScreening}>Load saved</button>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="screen-access-code">Coach access code</label>
            <input id="screen-access-code" required type="password" autoComplete="off" className="field" value={accessCode} onChange={(event) => setAccessCode(event.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="screen-movement">Movement</label>
            <select id="screen-movement" className="field" value={movementId} onChange={(event) => setMovementId(event.target.value)}>
              {movementOptions.map((movement) => <option key={movement.id} value={movement.id}>{movement.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="screen-priority">Training focus</label>
            <select id="screen-priority" className="field" value={priority} onChange={(event) => setPriority(event.target.value as MovementPriority)}>
              {priorities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ratingLabels.map(([key, label]) => (
            <label className="block" key={key}>
              <span className="label">{label}: {ratings[key]} / 5</span>
              <input type="range" min="1" max="5" className="mt-2 w-full accent-tcps-maroon" value={ratings[key]} onChange={(event) => setRatings({ ...ratings, [key]: Number(event.target.value) })} />
            </label>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 font-bold text-red-900">
            <input type="checkbox" className="size-5" checked={painReported} onChange={(event) => setPainReported(event.target.checked)} />
            Athlete reports pain
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 font-bold text-red-900">
            <input type="checkbox" className="size-5" checked={medicalConcern} onChange={(event) => setMedicalConcern(event.target.checked)} />
            Coach has a medical concern
          </label>
        </div>

        <div>
          <label className="label" htmlFor="screen-notes">Coach observations or follow-up context</label>
          <textarea id="screen-notes" maxLength={1500} className="field min-h-24" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Describe what you observed without adding identifying details." />
        </div>

        <div>
          <label className="label" htmlFor="screen-media">Photos or a short video</label>
          <input id="screen-media" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple className="field" onChange={updateMedia} />
          <p className="mt-1 text-xs leading-5 text-black/55">Choose up to four images or frames; videos are limited to 30 seconds and converted to three still frames in this browser. The video itself is not uploaded or saved.</p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <input type="checkbox" required className="mt-1 size-5 shrink-0" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} />
          I have confirmed required permission for the coach notes and selected images/frames to be sent to OpenAI for this screening. I have removed names, faces, uniforms, and other identifying details.
        </label>

        <button className="btn-primary w-full" type="submit" disabled={busy}>
          {busy ? "Preparing media and screening..." : "Run AI-assisted screen"}
        </button>
      </form>

      {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-900">{error}</p> : null}
      {notice ? <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">{notice}</p> : null}

      {screening ? (
        <div className="space-y-4 border-t border-black/10 pt-5">
          <div className={`rounded-xl p-4 ${screening.aiReview.riskLevel === "refer" ? "bg-red-50 text-red-950" : screening.aiReview.riskLevel === "coach_review" ? "bg-amber-50 text-amber-950" : "bg-emerald-50 text-emerald-950"}`}>
            <p className="text-sm font-black uppercase">AI suggestion: {screening.aiReview.riskLevel.replace("_", " ")}</p>
            <p className="mt-2 text-sm leading-6">{screening.aiReview.summary}</p>
          </div>
          {screening.aiReview.observations.length > 0 ? <div><h3 className="font-bold">Visible observations</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{screening.aiReview.observations.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div> : null}
          {screening.aiReview.referralReasons.length > 0 ? <div className="rounded-xl border border-red-200 p-3"><h3 className="font-bold text-red-900">Reasons to refer for qualified review</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-red-900">{screening.aiReview.referralReasons.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div> : null}
          {screening.aiReview.nextSteps.length > 0 ? <div><h3 className="font-bold">Suggested coach follow-up</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{screening.aiReview.nextSteps.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="coach-screen-decision">Coach decision {screening.aiReview.riskLevel === "refer" ? "(Hold or Refer only)" : ""}</label>
              <select id="coach-screen-decision" className="field" value={decision} onChange={(event) => setDecision(event.target.value as ParticipationStatus | "")}>
                <option value="">Select a decision</option>
                {allowedDecisions.map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="coach-screen-name">Coach name or initials</label>
              <input id="coach-screen-name" required maxLength={80} className="field" value={coachName} onChange={(event) => setCoachName(event.target.value)} />
            </div>
          </div>
          <button type="button" className="btn-primary w-full" disabled={!decision || !coachName.trim()} onClick={saveCoachDecision}>Save coach decision for {screenedAthleteId || "athlete"}</button>
        </div>
      ) : null}
    </section>
  );
}
