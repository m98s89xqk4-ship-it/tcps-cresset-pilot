'use client'

import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme, preference, toggleTheme, clearThemePreference, mounted } = useTheme()

  const isDark = theme === 'dark'
  const label = mounted ? (isDark ? 'Dark mode' : 'Light mode') : 'Toggle theme'
  const nextTheme = isDark ? 'light' : 'dark'
  const isSystem = preference === 'system'

  return (
    <div className="tcps-theme-controls">
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
      <button
        type="button"
        onClick={clearThemePreference}
        className={`tcps-theme-toggle tcps-theme-toggle--secondary ${isSystem ? 'tcps-theme-toggle--active' : ''}`}
        aria-pressed={isSystem}
        aria-label="Use system theme"
        title="Use system theme"
      >
        Auto
      </button>
    </div>
  )
}
