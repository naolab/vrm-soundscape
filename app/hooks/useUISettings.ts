import { useState, useCallback } from 'react'

/**
 * UI表示状態を管理するフック
 * 永続化が不要な一時的な状態を管理
 */
export const useUISettings = () => {
  const [showSettings, setShowSettings] = useState(false)

  const openSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev)
  }, [])

  return {
    showSettings,
    openSettings,
    closeSettings,
    toggleSettings
  }
}