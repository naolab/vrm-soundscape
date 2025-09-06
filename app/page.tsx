'use client'

import { useSettings } from './hooks/useSettings'
import { Menu } from './components/Menu'
import { Settings } from './components/settings'

export default function Home() {
  const {
    showSettings,
    currentTheme,
    themes,
    getBackgroundStyle,
    openSettings,
    closeSettings,
    changeTheme
  } = useSettings()

  return (
    <>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        ...getBackgroundStyle(currentTheme)
      }}>
        <Menu onOpenSettings={openSettings} />
      </main>

      {showSettings && (
        <Settings
          themes={themes}
          currentTheme={currentTheme}
          onClose={closeSettings}
          onThemeChange={changeTheme}
        />
      )}
    </>
  )
}