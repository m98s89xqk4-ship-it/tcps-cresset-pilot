import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

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
    <html lang="en" suppressHydrationWarning>
      <body className="app-shell">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <div className="tcps-topbar">
            <div className="tcps-topbar__inner">
              <ThemeToggle />
            </div>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
