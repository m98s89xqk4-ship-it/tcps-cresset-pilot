import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const themeScript = `
(function () {
  try {
    var storageKey = 'tcps-theme';
    var root = document.documentElement;
    var savedTheme = window.localStorage.getItem(storageKey);
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : systemTheme;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {}
})();
`

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
        <Script id="tcps-theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
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
