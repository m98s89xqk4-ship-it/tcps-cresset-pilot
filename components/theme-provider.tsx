'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'
type ThemePreference = Theme | 'system'

const THEME_STORAGE_KEY = 'tcps-theme'

interface ThemeContextValue {
  theme: Theme
  preference: ThemePreference
  mounted: boolean
  setTheme: (theme: Theme) => void
  clearThemePreference: () => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getThemeState(): { theme: Theme; preference: ThemePreference } {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return { theme: savedTheme, preference: savedTheme }
  }

  const documentTheme = document.documentElement.dataset.theme
  if (documentTheme === 'light' || documentTheme === 'dark') {
    return { theme: documentTheme, preference: 'system' }
  }

  const systemTheme = getSystemTheme()
  return { theme: systemTheme, preference: 'system' }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const nextState = getThemeState()
    applyTheme(nextState.theme)
    setThemeState(nextState.theme)
    setPreference(nextState.preference)
    setMounted(true)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(THEME_STORAGE_KEY)) {
        return
      }

      const systemTheme = event.matches ? 'dark' : 'light'
      applyTheme(systemTheme)
      setThemeState(systemTheme)
      setPreference('system')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme)
    setPreference(nextTheme)
    applyTheme(nextTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  const clearThemePreference = () => {
    const systemTheme = getSystemTheme()
    window.localStorage.removeItem(THEME_STORAGE_KEY)
    setThemeState(systemTheme)
    setPreference('system')
    applyTheme(systemTheme)
  }

  const toggleTheme = () => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'
      setPreference(nextTheme)
      applyTheme(nextTheme)
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      return nextTheme
    })
  }

  const value = useMemo(
    () => ({
      theme,
      preference,
      mounted,
      setTheme,
      clearThemePreference,
      toggleTheme,
    }),
    [theme, preference, mounted]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
