import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TCPS - Athlete Readiness & Movement Intelligence',
  description: 'TC Performance System - Cresset Christian Academy Pilot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
