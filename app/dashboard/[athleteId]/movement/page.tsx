'use client'

import Link from 'next/link'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { loadReadinessSnapshot, type AthleteReadinessSnapshot } from '@/lib/athlete-readiness'
import { INTEGRATED_PLAN_STORAGE_KEY, type IntegratedTrainingPlan, type ReadinessStatus } from '@/lib/integrated-training-plan'

const movements = [
  { name: 'Squat', category: 'Lower Body' },
  { name: 'Split Lunge', category: 'Lower Body' },
  { name: 'Hip Hinge', category: 'Lower Body' },
  { name: 'Calf Raise', category: 'Foot & Ankle' },
  { name: 'Snap Down', category: 'Athletic Prep' },
] as const

function calculateReadiness(readiness: AthleteReadinessSnapshot) {
  const score = Math.round(
    readiness.sleep * 4 +
      readiness.energy * 4 +
      (6 - readiness.soreness) * 4 +
      readiness.hydration * 3 +
      readiness.selfReadiness * 3 +
      (6 - readiness.stress) * 2,
  )

  const status: ReadinessStatus = readiness.painFlag ? 'RED' : score >= 80 ? 'GREEN' : score >= 60 ? 'YELLOW' : 'RED'
  return { score, status }
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Unable to read the selected image.'))
    }
    reader.onerror = () => reject(new Error('Unable to read the selected image.'))
    reader.readAsDataURL(file)
  })
}

async function resizeImage(file: File) {
  const dataUrl = await fileToDataUrl(file)

  return new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const maxDimension = 1600
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('Unable to prepare the image for upload.'))
        return
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => reject(new Error('Unable to process the selected image.'))
    image.src = dataUrl
  })
}

export default function MovementPage({ params }: { params: { athleteId: string } }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedMovement, setSelectedMovement] = useState<(typeof movements)[number]['name']>('Squat')
  const [readiness, setReadiness] = useState<AthleteReadinessSnapshot | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [integratedPlan, setIntegratedPlan] = useState<IntegratedTrainingPlan | null>(null)

  useEffect(() => {
    setReadiness(loadReadinessSnapshot())
    try {
      const storedPlan = window.sessionStorage.getItem(INTEGRATED_PLAN_STORAGE_KEY)
      if (storedPlan) {
        const parsed = JSON.parse(storedPlan) as IntegratedTrainingPlan
        if (parsed.athleteId === params.athleteId) {
          setIntegratedPlan(parsed)
          setSelectedMovement(parsed.movement as (typeof movements)[number]['name'])
        }
      }
    } catch {
      window.sessionStorage.removeItem(INTEGRATED_PLAN_STORAGE_KEY)
    }
  }, [params.athleteId])

  const readinessState = useMemo(() => (readiness ? calculateReadiness(readiness) : null), [readiness])

  const readinessColor = readinessState?.status === 'GREEN' ? 'bg-green-600' : readinessState?.status === 'YELLOW' ? 'bg-yellow-600' : 'bg-red-600'

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    setError('')
    setIntegratedPlan(null)

    try {
      const resized = await resizeImage(file)
      setImageDataUrl(resized)
      setFileName(file.name)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to prepare the selected image.')
    }
  }

  async function handleAnalyze() {
    if (!readiness) {
      setError('Complete readiness first so today’s movement plan can use the latest readiness snapshot.')
      return
    }

    if (!imageDataUrl) {
      setError('Add a movement image before requesting the integrated training plan.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/movement-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: params.athleteId,
          movement: selectedMovement,
          imageDataUrl,
          readiness: {
            ...readiness,
            athleteCode: params.athleteId,
          },
        }),
      })

      const payload = (await response.json()) as { error?: string; integratedPlan?: IntegratedTrainingPlan }
      if (!response.ok || !payload.integratedPlan) {
        throw new Error(payload.error || 'Unable to generate the integrated movement plan.')
      }

      setIntegratedPlan(payload.integratedPlan)
      window.sessionStorage.setItem(INTEGRATED_PLAN_STORAGE_KEY, JSON.stringify(payload.integratedPlan))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate the integrated movement plan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4 sm:p-6">
      <div className="mx-auto max-w-lg">
        <div className="py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22rem] text-gold">TC Performance System</p>
          <h1 className="mt-2 text-3xl font-black text-white">Movement Capture</h1>
          <p className="mt-2 text-sm text-gray-300">
            Athlete: <span className="font-bold text-gold">{params.athleteId}</span>
          </p>
        </div>

        {readinessState && (
          <div className={`${readinessColor} mb-6 rounded-2xl p-5 text-center text-white shadow-[0_16px_32px_rgba(0,0,0,0.2)]`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.22rem]">Linked Readiness</p>
            <p className="mt-2 text-4xl font-black">{readinessState.score} / 100</p>
            <p className="mt-2 text-lg font-bold">{readinessState.status}</p>
            <p className="mt-2 text-sm text-white/90">Movement analysis uses the latest readiness snapshot from today’s check-in.</p>
          </div>
        )}

        <div className="tcps-panel mb-6 p-4">
          <p className="text-center text-sm font-semibold text-gold">Select a baseline movement and capture one still image.</p>
          <p className="mt-2 text-center text-xs text-gray-300">Use a front or 45-degree view with the full body in frame.</p>
        </div>

        <div className="mb-6 space-y-3">
          {movements.map((movement) => (
            <button
              key={movement.name}
              onClick={() => setSelectedMovement(movement.name)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                selectedMovement === movement.name
                  ? 'border-gold bg-gold text-black shadow-[0_12px_24px_rgba(212,175,55,0.2)]'
                  : 'border-gold/50 bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <p className="text-base font-bold">{movement.name}</p>
              <p className={`mt-1 text-xs ${selectedMovement === movement.name ? 'text-black/75' : 'text-gray-300'}`}>{movement.category}</p>
            </button>
          ))}
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="mb-2 text-sm font-semibold text-gold">Capture Instructions</p>
          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-white/90">
            <li>Open the camera or photo picker on your phone.</li>
            <li>Keep feet, knees, hips, trunk, and head visible.</li>
            <li>Use one clear still image. The app resizes it before upload.</li>
          </ul>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="tcps-button-primary">
            📸 Open Camera / Choose Photo
          </button>
          <p className="mt-3 text-xs text-gray-300">Selected movement: <span className="font-bold text-gold">{selectedMovement}</span></p>
          {fileName && <p className="mt-1 text-xs text-gray-300">Selected file: {fileName}</p>}
          {imageDataUrl && (
            <img src={imageDataUrl} alt={`${selectedMovement} preview`} className="mt-4 w-full rounded-xl border border-gold/40 object-cover" />
          )}
        </div>

        <div className="tcps-panel mb-6 p-4">
          <p className="mb-3 text-sm font-semibold text-gold">Integrated Analysis</p>
          <p className="mb-4 text-sm text-white/90">
            The AI review stays inside coaching boundaries: visible movement only, no diagnosis, no medical clearance, and no pain inference.
          </p>
          <button type="button" onClick={handleAnalyze} disabled={loading} className="tcps-button-primary disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Analyzing Movement…' : 'Build Integrated Training Plan'}
          </button>
          {error && <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>}
        </div>

        {integratedPlan && (
          <div className="space-y-4">
            <div className="tcps-panel p-4">
              <p className="text-sm font-semibold text-gold">Integrated Result</p>
              <p className="mt-2 text-lg font-bold text-white">{integratedPlan.primaryObjective}</p>
              <p className="mt-2 text-sm text-white/85">{integratedPlan.movementAnalysis.summary}</p>
            </div>

            <div className="tcps-panel p-4">
              <p className="text-sm font-semibold text-gold">Top Coaching Cues</p>
              <div className="mt-3 space-y-2 text-sm text-white/90">
                {integratedPlan.movementAnalysis.coachingCues.map((cue) => (
                  <p key={cue}>• {cue}</p>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gold/40 bg-black/40 p-4">
              <p className="text-sm font-semibold text-gold">Curriculum Link</p>
              <p className="mt-2 text-white">Lesson {integratedPlan.curriculumConnection.sessionNumber}: {integratedPlan.curriculumConnection.title}</p>
              <p className="mt-2 text-sm text-gray-300">{integratedPlan.curriculumConnection.whyItMatters}</p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Link href={`/dashboard/${params.athleteId}/training`} className="tcps-button-primary">
            Continue to Training
          </Link>
          <Link href={`/dashboard/${params.athleteId}`} className="tcps-button-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
