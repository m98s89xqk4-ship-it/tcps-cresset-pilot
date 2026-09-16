'use client'

import { useTheme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  const isDark = theme === 'dark'
  const label = mounted ? (isDark ? 'Dark mode' : 'Light mode') : 'Toggle theme'
  const nextTheme = isDark ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="tcps-theme-toggle"
      aria-label={mounted ? `Current theme: ${label}. Activate to switch to ${nextTheme} mode.` : 'Toggle color theme'}
      title={mounted ? `Switch to ${nextTheme} mode` : 'Toggle color theme'}
    >
      <span aria-hidden="true" className="tcps-theme-toggle__icon">
        {mounted ? (isDark ? '☾' : '☀') : '◐'}
      </span>
      <span className="tcps-theme-toggle__label">{label}</span>
    </button>
  )
}
