'use client'

import { useState } from 'react'
import { useSettings } from './hooks/useSettings'
import { Menu } from './components/Menu'
import { Settings } from './components/settings'
import { VRMViewer } from './components/VRMViewer'

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
  
  const [followCamera, setFollowCamera] = useState(false)

  return (
    <>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        ...getBackgroundStyle(currentTheme)
      }}>
        <VRMViewer followCamera={followCamera} />
        <Menu onOpenSettings={openSettings} />
      </main>

      {showSettings && (
        <Settings
          themes={themes}
          currentTheme={currentTheme}
          followCamera={followCamera}
          onClose={closeSettings}
          onThemeChange={changeTheme}
          onFollowCameraChange={setFollowCamera}
        />
      )}
    </>
  )
}