'use client'

import { useState } from 'react'
import * as THREE from 'three'
import { useSettings } from './hooks/useSettings'
import { Menu } from './components/Menu'
import { Settings } from './components/settings'
import { VRMViewer } from './components/VRMViewer'
import { AudioPlayer } from './components/AudioPlayer'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function Home() {
  const {
    showSettings,
    currentTheme,
    followCamera,
    spatialAudio,
    volume,
    customVRMUrl,
    vrmFileName,
    isVRMLoading,
    themes,
    getBackgroundStyle,
    openSettings,
    closeSettings,
    changeTheme,
    changeFollowCamera,
    changeSpatialAudio,
    changeVolume,
    changeVRMFile,
    setVRMLoading
  } = useSettings()
  const [lipSyncVolume, setLipSyncVolume] = useState(0)
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [characterPosition, setCharacterPosition] = useState<THREE.Vector3 | null>(null)

  return (
    <>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative',
        ...getBackgroundStyle(currentTheme)
      }}>
        <ErrorBoundary
          fallback={
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#dc2626'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
              <div>VRMキャラクターの読み込みに失敗しました</div>
            </div>
          }
        >
          <VRMViewer
            modelPath={customVRMUrl || undefined}
            followCamera={followCamera}
            lipSyncVolume={lipSyncVolume}
            onCameraUpdate={setCamera}
            onCharacterPositionUpdate={setCharacterPosition}
            onLoadingStateChange={setVRMLoading}
          />
        </ErrorBoundary>
        <AudioPlayer 
          onVolumeChange={setLipSyncVolume}
          camera={camera}
          characterPosition={characterPosition}
          spatialAudio={spatialAudio}
          masterVolume={volume}
        />
        <Menu onOpenSettings={openSettings} />
      </main>

      {showSettings && (
        <Settings
          themes={themes}
          currentTheme={currentTheme}
          followCamera={followCamera}
          spatialAudio={spatialAudio}
          volume={volume}
          vrmFileName={vrmFileName || undefined}
          isVRMLoading={isVRMLoading}
          onClose={closeSettings}
          onThemeChange={changeTheme}
          onFollowCameraChange={changeFollowCamera}
          onSpatialAudioChange={changeSpatialAudio}
          onVolumeChange={changeVolume}
          onVRMFileChange={changeVRMFile}
        />
      )}
    </>
  )
}