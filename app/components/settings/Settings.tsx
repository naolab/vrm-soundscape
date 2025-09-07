import React from 'react'
import { Theme, ThemeOption } from '../../types/settings'
import { Button } from '../ui'
import { ThemeSettings } from './ThemeSettings'
import { CameraSettings } from './CameraSettings'
import { AudioSettings } from './AudioSettings'

interface SettingsProps {
  themes: ThemeOption[]
  currentTheme: Theme
  followCamera: boolean
  spatialAudio: boolean
  volume: number
  onClose: () => void
  onThemeChange: (theme: Theme) => void
  onFollowCameraChange: (value: boolean) => void
  onSpatialAudioChange: (value: boolean) => void
  onVolumeChange: (value: number) => void
}

export const Settings: React.FC<SettingsProps> = ({
  themes,
  currentTheme,
  followCamera,
  spatialAudio,
  volume,
  onClose,
  onThemeChange,
  onFollowCameraChange,
  onSpatialAudioChange,
  onVolumeChange
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 40
    }}>
      {/* Close Button */}
      <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
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

      {/* Settings Content */}
      <div style={{
        maxHeight: '100vh',
        overflow: 'auto',
        padding: '0'
      }}>
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          padding: '96px 40px 40px 40px'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '40px'
          }}>
            設定
          </div>
          
          <CameraSettings
            followCamera={followCamera}
            onFollowCameraChange={onFollowCameraChange}
          />
          
          <AudioSettings
            spatialAudio={spatialAudio}
            volume={volume}
            onSpatialAudioChange={onSpatialAudioChange}
            onVolumeChange={onVolumeChange}
          />
          
          <ThemeSettings
            themes={themes}
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>
    </div>
  )
}