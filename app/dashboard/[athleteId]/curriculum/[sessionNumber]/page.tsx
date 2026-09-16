'use client'

import Link from 'next/link'
import { useState } from 'react'
import { curriculum, getCurriculumSession, getCurriculumByPhase } from '@/lib/curriculum'

type ViewMode = 'overview' | 'lesson' | 'apply' | 'check'

export default function CurriculumPage({ params }: { params: { athleteId: string; sessionNumber?: string } }) {
  const sessionNum = params.sessionNumber ? parseInt(params.sessionNumber) : 1
  const session = getCurriculumSession(sessionNum)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [answers, setAnswers] = useState<Record<number, string>>({})

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
        <div className="max-w-md mx-auto text-center py-12">
          <p className="text-gold text-2xl font-bold mb-4">Lesson not found</p>
          <Link href={`/dashboard/${params.athleteId}`} className="text-gold hover:text-yellow-400">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const allSessions = curriculum
  const currentIndex = allSessions.findIndex((s) => s.number === sessionNum)
  const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null
  const nextSession = currentIndex < allSessions.length - 1 ? allSessions[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-maroon p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <p className="text-gold text-xs font-semibold">TC PERFORMANCE SYSTEM</p>
          <h1 className="text-2xl font-bold text-white">Recovery & Durability</h1>
          <p className="text-gray-300 text-sm mt-1">Athlete: <span className="font-bold text-gold">{params.athleteId}</span></p>
        </div>

        {/* Session Header */}
        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gold text-xs font-semibold mb-1">{session.phase}</p>
              <h2 className="text-3xl font-bold text-white mb-2">{session.title}</h2>
              <p className="text-gold text-sm font-semibold">Session {session.number} of 15</p>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center">
                <p className="text-black font-bold text-2xl">{session.number}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gold border-opacity-30 pt-4 mt-4">
            <p className="text-gray-300 text-xs uppercase font-semibold mb-2">Learning Standard</p>
            <p className="text-white text-sm italic">{session.standard}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(['overview', 'lesson', 'apply', 'check'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`py-2 px-3 rounded-lg font-bold text-xs transition-all duration-200 transform hover:scale-105 ${
                viewMode === mode
                  ? 'bg-gold text-black'
                  : 'bg-black border border-gold text-gold hover:bg-opacity-70'
              }`}
            >
              {mode === 'overview' && 'Overview'}
              {mode === 'lesson' && 'Full Lesson'}
              {mode === 'apply' && 'Apply It'}
              {mode === 'check' && 'Check'}
            </button>
          ))}
        </div>

        {/* Overview Mode */}
        {viewMode === 'overview' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-2">About This Lesson</p>
              <p className="text-white text-sm">{session.description}</p>
            </div>

            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">Key Ideas</p>
              <ul className="space-y-2">
                {session.keyIdeas.map((idea, idx) => (
                  <li key={idx} className="text-white text-sm flex items-start">
                    <span className="text-gold mr-2 font-bold">•</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">Key Terms</p>
              <div className="flex flex-wrap gap-2">
                {session.keyTerms.map((term, idx) => (
                  <div key={idx} className="bg-gold bg-opacity-20 border border-gold border-opacity-50 rounded px-3 py-1">
                    <p className="text-gold text-xs font-semibold">{term}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full Lesson Mode */}
        {viewMode === 'lesson' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">Full Lesson</p>
              <p className="text-white text-sm leading-relaxed mb-4">{session.description}</p>
              
              <p className="text-gold font-semibold mb-2 text-sm">Why This Matters</p>
              <ul className="space-y-2 mb-4">
                {session.keyIdeas.map((idea, idx) => (
                  <li key={idx} className="text-white text-sm text-gray-300">{idea}</li>
                ))}
              </ul>

              <p className="text-gold font-semibold mb-2 text-sm">Important Terms</p>
              <div className="space-y-2">
                {session.keyTerms.map((term, idx) => (
                  <div key={idx} className="text-white text-sm">
                    <p className="font-bold text-gold">{term}</p>
                    <p className="text-gray-300 text-xs ml-2">See your coach or textbook for full definition.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-900 bg-opacity-30 border border-blue-600 border-opacity-50 rounded-lg p-4">
              <p className="text-blue-200 font-semibold mb-2">💡 Coach Note</p>
              <p className="text-blue-100 text-sm">
                This lesson connects to your daily readiness and training decisions. Use what you learn here to make better choices about preparation and recovery.
              </p>
            </div>
          </div>
        )}

        {/* Apply It Mode */}
        {viewMode === 'apply' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">Apply This Lesson</p>
              <p className="text-white text-sm mb-4">
                Take one key idea from this lesson and apply it in your training this week.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-gold text-xs font-semibold mb-2">This Week&apos;s Challenge</p>
                  <p className="text-white text-sm">
                    {session.number === 1 && 'Complete one recovery action after your next workout. Notice how it affects your next readiness score.'}
                    {session.number === 2 && 'Establish your movement baseline. Record your readiness score and describe how you are moving today.'}
                    {session.number === 3 && 'Build a three-step bedtime routine. Use it for three nights and track your sleep quality rating.'}
                    {session.number === 4 && 'Create a hydration plan for your next practice. Keep a water bottle with you and take at least 5 sips.'}
                    {session.number === 5 && 'Choose one familiar food for your next competition. Try it during warm-up to make sure it works.'}
                    {session.number === 6 && 'Practice controlled breathing for 2 minutes after your next workout. Use a position you find comfortable.'}
                    {session.number === 7 && 'Identify one movement that feels tight. Select a mobility drill and test whether it helps. Recheck the movement.'}
                    {session.number === 8 && 'Practice foot and ankle control for 5 minutes. Focus on pressure through your whole foot and a stable tripod position.'}
                    {session.number === 9 && 'Practice hip and groin strength exercises. Notice control through your pelvis, knee, and foot.'}
                    {session.number === 10 && 'Use a trunk and shoulder reset that works at school or home. Do it once today and notice the change.'}
                    {session.number === 11 && 'Practice one landing repetition with quiet feet and a 2-second hold. Film yourself if possible.'}
                    {session.number === 12 && 'Practice controlled stops in a straight line. Focus on gradually lowering your center of mass.'}
                    {session.number === 13 && 'Hold one isometric position for 20-30 seconds with good alignment. Stop if form breaks down.'}
                    {session.number === 14 && 'Try one slow lowering movement. Count 3-4 seconds down and notice your control.'}
                    {session.number === 15 && 'Describe three things you felt during training. Label each as soreness, pain, or concern.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-900 bg-opacity-30 border border-green-600 border-opacity-50 rounded-lg p-4">
              <p className="text-green-200 font-semibold mb-2">✓ Your Task</p>
              <p className="text-green-100 text-sm">Complete this week&apos;s challenge and be ready to share what you discovered with your coach or class.</p>
            </div>
          </div>
        )}

        {/* Knowledge Check Mode */}
        {viewMode === 'check' && (
          <div className="space-y-4 mb-6">
            <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
              <p className="text-gold font-semibold mb-3">Knowledge Check</p>
              <p className="text-white text-sm mb-4">Answer the following to check your understanding.</p>

              {session.number === 1 && (
                <div className="space-y-4">
                  <div className="bg-black bg-opacity-50 rounded p-3 border border-gold border-opacity-30">
                    <p className="text-white font-semibold mb-2">Question 1</p>
                    <p className="text-white text-sm mb-3">What is the relationship between training and recovery?</p>
                    <textarea
                      value={answers[1] || ''}
                      onChange={(e) => setAnswers({ ...answers, 1: e.target.value })}
                      className="w-full bg-black bg-opacity-70 border border-gold text-white p-2 rounded text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  </div>

                  <div className="bg-black bg-opacity-50 rounded p-3 border border-gold border-opacity-30">
                    <p className="text-white font-semibold mb-2">Question 2</p>
                    <p className="text-white text-sm mb-3">Name three recovery behaviors that come before optional tools.</p>
                    <textarea
                      value={answers[2] || ''}
                      onChange={(e) => setAnswers({ ...answers, 2: e.target.value })}
                      className="w-full bg-black bg-opacity-70 border border-gold text-white p-2 rounded text-sm"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  </div>
                </div>
              )}

              {session.number > 1 && (
                <div className="bg-gold bg-opacity-10 border border-gold border-opacity-30 rounded p-4">
                  <p className="text-gold text-sm">
                    Knowledge checks for this lesson are coming soon. Review the key ideas and main points above and be ready to discuss them with your coach.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {prevSession && (
              <Link
                href={`/dashboard/${params.athleteId}/curriculum/${prevSession.number}`}
                className="bg-black border border-gold text-gold font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 text-sm"
              >
                ← Previous
              </Link>
            )}
            {nextSession && (
              <Link
                href={`/dashboard/${params.athleteId}/curriculum/${nextSession.number}`}
                className="bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105 text-sm ml-auto w-1/2"
              >
                Next →
              </Link>
            )}
          </div>

          <Link
            href={`/dashboard/${params.athleteId}/recovery`}
            className="block w-full bg-black border border-gold text-gold font-bold py-3 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
          >
            Back to Recovery
          </Link>
        </div>

        {/* Progress */}
        <div className="bg-black bg-opacity-50 border border-gold border-opacity-30 rounded-lg p-4">
          <p className="text-gold font-semibold mb-2">Your Progress</p>
          <div className="w-full bg-black rounded h-2 mb-2">
            <div
              className="bg-gold h-2 rounded transition-all duration-300"
              style={{ width: `${(sessionNum / 15) * 100}%` }}
            ></div>
          </div>
          <p className="text-white text-xs">{sessionNum} of 15 lessons</p>
        </div>
      </div>
    </div>
  )
}
