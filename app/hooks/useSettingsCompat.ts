import { useThemeSettings } from './useThemeSettings'
import { useAudioSettings } from './useAudioSettings'
import { useVRMSettings } from './useVRMSettings'
import { useUISettings } from './useUISettings'

/**
 * 従来のuseSettingsとの互換性を保つための統合フック
 * 段階的移行を可能にする
 */
export const useSettingsCompat = () => {
  const themeSettings = useThemeSettings()
  const audioSettings = useAudioSettings()
  const vrmSettings = useVRMSettings()
  const uiSettings = useUISettings()

  return {
    // UI Settings
    showSettings: uiSettings.showSettings,
    openSettings: uiSettings.openSettings,
    closeSettings: uiSettings.closeSettings,

    // Theme Settings
    currentTheme: themeSettings.currentTheme,
    themes: themeSettings.themes,
    getBackgroundStyle: themeSettings.getBackgroundStyle,
    changeTheme: themeSettings.changeTheme,

    // VRM Settings
    followCamera: vrmSettings.followCamera,
    customVRMUrl: vrmSettings.customVRMUrl,
    vrmFileName: vrmSettings.vrmFileName,
    isVRMLoading: vrmSettings.isVRMLoading,
    changeFollowCamera: vrmSettings.changeFollowCamera,
    changeVRMFile: vrmSettings.changeVRMFile,
    setVRMLoading: vrmSettings.setVRMLoading,

    // Audio Settings
    spatialAudio: audioSettings.spatialAudio,
    volume: audioSettings.volume,
    audioFiles: audioSettings.audioFiles,
    selectedAudioId: audioSettings.selectedAudioId,
    currentPlayingAudio: audioSettings.currentPlayingAudio,
    changeSpatialAudio: audioSettings.changeSpatialAudio,
    changeVolume: audioSettings.changeVolume,
    changeAudioFiles: audioSettings.changeAudioFiles,
    changeSelectedAudio: audioSettings.changeSelectedAudio,
    playAudio: audioSettings.playAudio
  }
}