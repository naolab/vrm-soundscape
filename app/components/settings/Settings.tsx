import React, { useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 40
    }}>
      {/* Close Button */}
      <div style={{ position: 'absolute', top: 'clamp(16px, 3vh, 24px)', left: 'clamp(16px, 3vw, 24px)', zIndex: 50 }}>
        <Button
          onClick={onClose}
          style={{
            width: 'clamp(36px, 8vw, 44px)',
            height: 'clamp(36px, 8vw, 44px)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: '#666',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          ×
        </Button>
      </div>

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: isMobile ? '10px' : '20px',
        boxSizing: 'border-box'
      }}>
        {/* Settings Panel */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: isMobile ? 'calc(100vh - 20px)' : 'calc(100vh - 40px)',
          minHeight: '600px',
          boxSizing: 'border-box'
        }}>
        {/* Mobile Tab Selector */}
        {isMobile && (
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(248, 250, 252, 0.95)',
            borderRadius: '12px 12px 0 0',
            padding: '8px',
            marginBottom: '0',
            overflowX: 'auto'
          }}>
            {(['vrm', 'audio', 'display'] as SettingsTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  backgroundColor: activeTab === tab ? '#805ad5' : 'transparent',
                  color: activeTab === tab ? 'white' : '#805ad5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? '600' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  margin: '0 2px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab === 'vrm' ? 'VRM' : tab === 'audio' ? '音声' : '表示'}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Left Sidebar Tabs */}
        {!isMobile && (
          <SettingsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

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
    </div>
  )
}