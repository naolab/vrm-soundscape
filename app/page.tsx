'use client'

import { useState } from 'react'
import * as THREE from 'three'
import { useSettings } from './hooks/useSettings'
import { Menu } from './components/Menu'
import { Settings } from './components/settings'
import { VRMViewer } from './components/VRMViewer'
import { AudioPlayer } from './components/AudioPlayer'

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
  const [lipSyncVolume, setLipSyncVolume] = useState(0)
  const [camera, setCamera] = useState<THREE.Camera | null>(null)
  const [characterPosition, setCharacterPosition] = useState<THREE.Vector3 | null>(null)

  return (
    <>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        ...getBackgroundStyle(currentTheme)
      }}>
        <VRMViewer 
          followCamera={followCamera} 
          lipSyncVolume={lipSyncVolume}
          onCameraUpdate={setCamera}
          onCharacterPositionUpdate={setCharacterPosition}
        />
        <AudioPlayer 
          onVolumeChange={setLipSyncVolume}
          camera={camera}
          characterPosition={characterPosition}
        />
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