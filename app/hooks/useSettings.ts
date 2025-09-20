import { useState, useCallback, useEffect } from 'react'
import { Theme, ThemeOption } from '../types/settings'

const STORAGE_KEY = 'vrm-soundscape-settings'

const loadSettings = (): { theme: Theme; followCamera: boolean; spatialAudio: boolean; volume: number; customVRMUrl?: string } => {
  if (typeof window === 'undefined') return { theme: 'blue', followCamera: false, spatialAudio: true, volume: 0.5 }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        theme: parsed.theme || 'blue',
        followCamera: parsed.followCamera || false,
        spatialAudio: parsed.spatialAudio !== undefined ? parsed.spatialAudio : true,
        volume: parsed.volume !== undefined ? parsed.volume : 0.5,
        customVRMUrl: parsed.customVRMUrl
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error)
  }

  return { theme: 'blue', followCamera: false, spatialAudio: true, volume: 0.5 }
}

const saveSettings = (theme: Theme, followCamera: boolean, spatialAudio: boolean, volume: number, customVRMUrl?: string): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, followCamera, spatialAudio, volume, customVRMUrl }))
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export const useSettings = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>('blue')
  const [followCamera, setFollowCamera] = useState(false)
  const [spatialAudio, setSpatialAudio] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [customVRMUrl, setCustomVRMUrl] = useState<string | null>(null)
  const [vrmFileName, setVrmFileName] = useState<string | null>(null)
  const [isVRMLoading, setIsVRMLoading] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const settings = loadSettings()
    setCurrentTheme(settings.theme)
    // Always set followCamera to false on reload
    setFollowCamera(false)
    setSpatialAudio(settings.spatialAudio)
    setVolume(settings.volume)
    setCustomVRMUrl(settings.customVRMUrl || null)
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
    saveSettings(theme, followCamera, spatialAudio, volume, customVRMUrl || undefined)
  }, [followCamera, spatialAudio, volume, customVRMUrl])

  const changeFollowCamera = useCallback((newFollowCamera: boolean) => {
    setFollowCamera(newFollowCamera)
    saveSettings(currentTheme, newFollowCamera, spatialAudio, volume, customVRMUrl || undefined)
  }, [currentTheme, spatialAudio, volume, customVRMUrl])

  const changeSpatialAudio = useCallback((newSpatialAudio: boolean) => {
    setSpatialAudio(newSpatialAudio)
    saveSettings(currentTheme, followCamera, newSpatialAudio, volume, customVRMUrl || undefined)
  }, [currentTheme, followCamera, volume, customVRMUrl])

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
    saveSettings(currentTheme, followCamera, spatialAudio, newVolume, customVRMUrl || undefined)
  }, [currentTheme, followCamera, spatialAudio, customVRMUrl])

  const changeVRMFile = useCallback((file: File | null) => {
    setIsVRMLoading(true)

    if (!file) {
      // Reset to default VRM
      setCustomVRMUrl(null)
      setVrmFileName(null)
      saveSettings(currentTheme, followCamera, spatialAudio, volume, undefined)
      setIsVRMLoading(false)
      return
    }

    // Create object URL for the file
    const url = URL.createObjectURL(file)
    setCustomVRMUrl(url)
    setVrmFileName(file.name)
    saveSettings(currentTheme, followCamera, spatialAudio, volume, url)

    // Note: isVRMLoading will be set to false by the VRMViewer component
    // when the model is successfully loaded
  }, [currentTheme, followCamera, spatialAudio, volume])

  const setVRMLoading = useCallback((loading: boolean) => {
    setIsVRMLoading(loading)
  }, [])

  return {
    showSettings,
    currentTheme,
    followCamera,
    spatialAudio,
    volume,
    customVRMUrl,
    vrmFileName,
    isVRMLoading,
    themes,
    getBackgroundStyle,
    openSettings,
    closeSettings,
    changeTheme,
    changeFollowCamera,
    changeSpatialAudio,
    changeVolume,
    changeVRMFile,
    setVRMLoading
  }
}