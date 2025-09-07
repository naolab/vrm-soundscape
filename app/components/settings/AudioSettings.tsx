import React from 'react'
import { ToggleSwitch } from '../ui/ToggleSwitch'

interface AudioSettingsProps {
  spatialAudio: boolean
  onSpatialAudioChange: (value: boolean) => void
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  spatialAudio,
  onSpatialAudioChange
}) => {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
      }}>
        音響設定
      </div>

      <ToggleSwitch
        checked={spatialAudio}
        onChange={onSpatialAudioChange}
        label="立体音響"
      />
    </div>
  )
}