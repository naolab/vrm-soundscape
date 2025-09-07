'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { LipSync } from '../lib/LipSync'
import { UI_STYLES } from '../constants/ui'
import { useDistanceVolumeControl } from '../hooks/useDistanceVolumeControl'

interface AudioPlayerProps {
  onVolumeChange?: (volume: number) => void
  camera?: THREE.PerspectiveCamera
  characterPosition?: THREE.Vector3
  spatialAudio?: boolean
}

export const AudioPlayer = React.memo<AudioPlayerProps>(({ onVolumeChange, camera, characterPosition, spatialAudio = true }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const lipSyncRef = useRef<LipSync | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const animationRef = useRef<number | null>(null)

  // Use optimized distance-based volume control
  useDistanceVolumeControl(lipSyncRef, isPlaying, camera, characterPosition)

  // Update spatial audio setting when it changes
  useEffect(() => {
    if (lipSyncRef.current) {
      lipSyncRef.current.setSpatialEnabled(spatialAudio)
    }
  }, [spatialAudio])

  const play = useCallback(async () => {
    try {
      if (!lipSyncRef.current) {
        lipSyncRef.current = new LipSync()
      }

      // Set spatial audio state
      lipSyncRef.current.setSpatialEnabled(spatialAudio)

      const source = await lipSyncRef.current.startAnalysis('/audio/test.wav')
      if (!source) return

      sourceRef.current = source
      source.start()
      setIsPlaying(true)

      // Volume monitoring loop
      const updateVolume = () => {
        if (lipSyncRef.current && sourceRef.current) {
          const volume = lipSyncRef.current.getVolume()
          onVolumeChange?.(volume)
          animationRef.current = requestAnimationFrame(updateVolume)
        }
      }
      updateVolume()

      source.onended = () => {
        setIsPlaying(false)
        sourceRef.current = null
        onVolumeChange?.(0)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      }
    } catch (error) {
      setIsPlaying(false)
    }
  }, [spatialAudio, onVolumeChange])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.stop()
    }
    setIsPlaying(false)
    onVolumeChange?.(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [onVolumeChange])

  return (
    <button
      onClick={isPlaying ? stop : play}
      style={{
        ...UI_STYLES.POSITION.AUDIO_PLAYER,
        ...UI_STYLES.BUTTON.BASE,
        ...UI_STYLES.BUTTON.AUDIO_PLAYER
      }}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  )
})