import React from 'react'

interface CameraSettingsProps {
  followCamera: boolean
  onFollowCameraChange: (value: boolean) => void
}

export const CameraSettings: React.FC<CameraSettingsProps> = ({
  followCamera,
  onFollowCameraChange
}) => {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
      }}>
        カメラ設定
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#333'
        }}>
          カメラ追従
        </div>

        <label style={{
          position: 'relative',
          display: 'inline-block',
          width: '60px',
          height: '32px'
        }}>
          <input
            type="checkbox"
            checked={followCamera}
            onChange={(e) => onFollowCameraChange(e.target.checked)}
            style={{
              opacity: 0,
              width: 0,
              height: 0
            }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: followCamera ? '#4CAF50' : '#ccc',
            transition: '0.4s',
            borderRadius: '34px'
          }}>
            <span style={{
              position: 'absolute',
              content: '',
              height: '24px',
              width: '24px',
              left: followCamera ? '32px' : '4px',
              bottom: '4px',
              backgroundColor: 'white',
              transition: '0.4s',
              borderRadius: '50%'
            }} />
          </span>
        </label>
      </div>
    </div>
  )
}