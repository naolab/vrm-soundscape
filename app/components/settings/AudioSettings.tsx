import React from 'react'
import { ToggleSwitch } from '../ui/ToggleSwitch'

interface AudioSettingsProps {
  spatialAudio: boolean
  volume: number
  onSpatialAudioChange: (value: boolean) => void
  onVolumeChange: (value: number) => void
}

export const AudioSettings: React.FC<AudioSettingsProps> = ({
  spatialAudio,
  volume,
  onSpatialAudioChange,
  onVolumeChange
}) => {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px'
      }}>
        音響設定
      </div>

      <ToggleSwitch
        checked={spatialAudio}
        onChange={onSpatialAudioChange}
        label="立体音響"
      />
      
      <div style={{ marginTop: '24px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '12px'
        }}>
          音量 ({Math.round(volume * 100)}%)
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: '#e5e7eb',
            outline: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
        />
      </div>
    </div>
  )
}