import { useState, useCallback } from 'react'
import { Theme, SettingsState, ThemeOption } from '../types/settings'

export const useSettings = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>('blue')

  const themes: ThemeOption[] = [
    { value: 'blue', color: '#3B82F6' },
    { value: 'green', color: '#10B981' },
    { value: 'orange', color: '#F59E0B' },
    { value: 'pink', color: '#EC4899' },
    { value: 'purple', color: '#8B5CF6' }
  ]

  const getBackgroundStyle = useCallback((theme: Theme) => {
    return {
      backgroundImage: `url(/textures/${theme}.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }, [])

  const openSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  const changeTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme)
  }, [])

  return {
    showSettings,
    currentTheme,
    themes,
    getBackgroundStyle,
    openSettings,
    closeSettings,
    changeTheme
  }
}