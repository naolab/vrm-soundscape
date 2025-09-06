import React from 'react'
import { Button } from './ui'
import { UI_STYLES } from '../constants/ui'

interface MenuProps {
  onOpenSettings: () => void
}

export const Menu: React.FC<MenuProps> = React.memo(({ onOpenSettings }) => {
  return (
    <div style={UI_STYLES.POSITION.MENU}>
      <Button
        onClick={onOpenSettings}
        style={{
          ...UI_STYLES.BUTTON.BASE,
          ...UI_STYLES.BUTTON.MENU
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
})