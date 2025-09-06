import { useState, useCallback, useEffect } from 'react'
import { Theme, SettingsState, ThemeOption } from '../types/settings'

const STORAGE_KEY = 'vrm-soundscape-settings'

const loadSettings = (): { theme: Theme; followCamera: boolean } => {
  if (typeof window === 'undefined') return { theme: 'blue', followCamera: false }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        theme: parsed.theme || 'blue',
        followCamera: parsed.followCamera || false
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error)
  }
  
  return { theme: 'blue', followCamera: false }
}

const saveSettings = (theme: Theme, followCamera: boolean): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, followCamera }))
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export const useSettings = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>('blue')
  const [followCamera, setFollowCamera] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const settings = loadSettings()
    setCurrentTheme(settings.theme)
    setFollowCamera(settings.followCamera)
  }, [])

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
    saveSettings(theme, followCamera)
  }, [followCamera])

  const changeFollowCamera = useCallback((newFollowCamera: boolean) => {
    setFollowCamera(newFollowCamera)
    saveSettings(currentTheme, newFollowCamera)
  }, [currentTheme])

  return {
    showSettings,
    currentTheme,
    followCamera,
    themes,
    getBackgroundStyle,
    openSettings,
    closeSettings,
    changeTheme,
    changeFollowCamera
  }
}