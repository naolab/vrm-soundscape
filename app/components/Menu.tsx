import React from 'react'
import { Button } from './ui'

interface MenuProps {
  onOpenSettings: () => void
}

export const Menu: React.FC<MenuProps> = ({ onOpenSettings }) => {
  return (
    <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
      <Button
        onClick={onOpenSettings}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          gap: '3px'
        }}
      >
        <div style={{
          width: '18px',
          height: '2px',
          backgroundColor: '#666',
          borderRadius: '1px'
        }} />
        <div style={{
          width: '18px',
          height: '2px',
          backgroundColor: '#666',
          borderRadius: '1px'
        }} />
        <div style={{
          width: '18px',
          height: '2px',
          backgroundColor: '#666',
          borderRadius: '1px'
        }} />
      </Button>
    </div>
  )
}