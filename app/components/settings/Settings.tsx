import React, { useState } from 'react'
import { Theme, ThemeOption } from '../../types/settings'
import { Button } from '../ui'
import { AudioFile } from '../../types/audio'
import { SettingsTabs, SettingsTab } from './SettingsTabs'
import { TabContent } from './TabContent'

interface SettingsProps {
  themes: ThemeOption[]
  currentTheme: Theme
  followCamera: boolean
  spatialAudio: boolean
  volume: number
  vrmFileName?: string
  isVRMLoading?: boolean
  audioFiles: AudioFile[]
  currentPlayingAudio?: string | null
  onClose: () => void
  onThemeChange: (theme: Theme) => void
  onFollowCameraChange: (value: boolean) => void
  onSpatialAudioChange: (value: boolean) => void
  onVolumeChange: (value: number) => void
  onVRMFileChange: (file: File | null) => void
  onAudioFilesChange: (files: AudioFile[]) => void
  onPlayAudio: (audioFile: AudioFile) => void
}

export const Settings: React.FC<SettingsProps> = ({
  themes,
  currentTheme,
  followCamera,
  spatialAudio,
  volume,
  vrmFileName,
  isVRMLoading,
  audioFiles,
  currentPlayingAudio,
  onClose,
  onThemeChange,
  onFollowCameraChange,
  onSpatialAudioChange,
  onVolumeChange,
  onVRMFileChange,
  onAudioFilesChange,
  onPlayAudio
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('vrm')

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 40
    }}>
      {/* Close Button */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 50 }}>
        <Button
          onClick={onClose}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: '#666',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          ×
        </Button>
      </div>

      {/* Main Content Layout */}
      <div style={{
        display: 'flex',
        height: '100vh',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '40px',
        paddingRight: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Left Sidebar Tabs */}
        <SettingsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Right Content Area */}
        <TabContent
          activeTab={activeTab}
          // VRM settings
          vrmFileName={vrmFileName}
          isVRMLoading={isVRMLoading}
          onVRMFileChange={onVRMFileChange}
          followCamera={followCamera}
          onFollowCameraChange={onFollowCameraChange}
          // Audio settings
          spatialAudio={spatialAudio}
          volume={volume}
          onSpatialAudioChange={onSpatialAudioChange}
          onVolumeChange={onVolumeChange}
          audioFiles={audioFiles}
          currentPlayingAudio={currentPlayingAudio}
          onAudioFilesChange={onAudioFilesChange}
          onPlayAudio={onPlayAudio}
          // Display settings
          themes={themes}
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />
      </div>
    </div>
  )
}