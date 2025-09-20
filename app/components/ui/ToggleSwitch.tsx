import React from 'react'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = React.memo(({
  checked,
  onChange,
  label
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      {label && (
        <span style={{ color: '#333', fontSize: '18px', fontWeight: '500' }}>
          {label}
        </span>
      )}
      <label style={{
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '32px'
      }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
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
          backgroundColor: checked ? '#4CAF50' : '#ccc',
          transition: '0.4s',
          borderRadius: '34px'
        }}>
          <span style={{
            position: 'absolute',
            content: '',
            height: '24px',
            width: '24px',
            left: checked ? '32px' : '4px',
            bottom: '4px',
            backgroundColor: 'white',
            transition: '0.4s',
            borderRadius: '50%'
          }} />
        </span>
      </label>
    </div>
  )
})