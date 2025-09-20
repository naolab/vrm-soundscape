'use client'

import { useState, Suspense, lazy, useCallback } from 'react'
import * as THREE from 'three'
import { useThemeSettings } from './hooks/useThemeSettings'
import { useAudioSettings } from './hooks/useAudioSettings'
import { useVRMSettings } from './hooks/useVRMSettings'
import { useUISettings } from './hooks/useUISettings'
import { Menu } from './components/Menu'
import { Settings } from './components/settings'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

// 重いコンポーネントを動的インポート
const VRMViewer = lazy(() => import('./components/VRMViewer').then(module => ({ default: module.VRMViewer })))
const AudioPlayer = lazy(() => import('./components/AudioPlayer').then(module => ({ default: module.AudioPlayer })))

export default function Home() {
  // 細分化されたフックを使用
  const { currentTheme, themes, getBackgroundStyle, changeTheme } = useThemeSettings()
  const {
    spatialAudio,
    volume,
    audioFiles,
    selectedAudioId,
    currentPlayingAudio,
    changeSpatialAudio,
    changeVolume,
    changeAudioFiles,
    changeSelectedAudio,
    playAudio
  } = useAudioSettings()
  const {
    followCamera,
    customVRMUrl,
    vrmFileName,
    isVRMLoading,
    changeFollowCamera,
    changeVRMFile,
    setVRMLoading
  } = useVRMSettings()
  const { showSettings, openSettings, closeSettings } = useUISettings()
  const [lipSyncVolume, setLipSyncVolume] = useState(0)
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  const [characterPosition, setCharacterPosition] = useState<THREE.Vector3 | null>(null)

  // コールバック関数をメモ化
  const handleCameraUpdate = useCallback((camera: THREE.PerspectiveCamera) => {
    setCamera(camera)
  }, [])

  const handleCharacterPositionUpdate = useCallback((position: THREE.Vector3) => {
    setCharacterPosition(position)
  }, [])

  const handleVRMLoadingStateChange = useCallback((loading: boolean) => {
    setVRMLoading(loading)
  }, [setVRMLoading])

  const handleVolumeChange = useCallback((volume: number) => {
    setLipSyncVolume(volume)
  }, [])

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
          <Suspense fallback={
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <LoadingSpinner message="VRMキャラクターを読み込み中..." />
            </div>
          }>
            <VRMViewer
              modelPath={customVRMUrl || undefined}
              followCamera={followCamera}
              lipSyncVolume={lipSyncVolume}
              onCameraUpdate={handleCameraUpdate}
              onCharacterPositionUpdate={handleCharacterPositionUpdate}
              onLoadingStateChange={handleVRMLoadingStateChange}
            />
          </Suspense>
        </ErrorBoundary>
        <Suspense fallback={
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <LoadingSpinner size="sm" message="音声プレイヤーを読み込み中..." />
          </div>
        }>
          <AudioPlayer
            onVolumeChange={handleVolumeChange}
            camera={camera}
          characterPosition={characterPosition}
          spatialAudio={spatialAudio}
          masterVolume={volume}
          audioFiles={audioFiles}
          selectedAudioId={selectedAudioId}
          onAudioSelect={changeSelectedAudio}
        />
        </Suspense>
        <Menu onOpenSettings={openSettings} />
      </main>

      <Settings
        isOpen={showSettings}
        themes={themes}
        currentTheme={currentTheme}
          followCamera={followCamera}
          spatialAudio={spatialAudio}
          volume={volume}
          vrmFileName={vrmFileName || undefined}
          isVRMLoading={isVRMLoading}
          audioFiles={audioFiles}
          currentPlayingAudio={currentPlayingAudio}
          onClose={closeSettings}
          onThemeChange={changeTheme}
          onFollowCameraChange={changeFollowCamera}
          onSpatialAudioChange={changeSpatialAudio}
          onVolumeChange={changeVolume}
          onVRMFileChange={changeVRMFile}
          onAudioFilesChange={changeAudioFiles}
          onPlayAudio={playAudio}
        />
    </>
  )
}