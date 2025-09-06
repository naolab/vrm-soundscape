export const UI_STYLES = {
  BUTTON: {
    BASE: {
      border: 'none',
      cursor: 'pointer',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    MENU: {
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: '3px'
    },
    AUDIO_PLAYER: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      fontSize: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const
    }
  },
  POSITION: {
    MENU: {
      position: 'absolute' as const,
      top: '24px',
      left: '24px',
      zIndex: 10
    },
    AUDIO_PLAYER: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px'
    }
  }
} as const