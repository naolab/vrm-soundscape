'use client'

import { useState, useRef } from 'react'
import { LipSync } from '../lib/LipSync'

interface AudioPlayerProps {
  onVolumeChange?: (volume: number) => void
}

export function AudioPlayer({ onVolumeChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const lipSyncRef = useRef<LipSync | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const animationRef = useRef<number | null>(null)

  const play = async () => {
    try {
      if (!lipSyncRef.current) {
        lipSyncRef.current = new LipSync()
      }

      const source = await lipSyncRef.current.startAnalysis('/audio/test.wav')
      if (!source) return

      sourceRef.current = source
      source.start()
      setIsPlaying(true)

      // Volume monitoring loop
      const updateVolume = () => {
        if (lipSyncRef.current && isPlaying) {
          const volume = lipSyncRef.current.getVolume()
          onVolumeChange?.(volume)
          animationRef.current = requestAnimationFrame(updateVolume)
        }
      }
      updateVolume()

      source.onended = () => {
        setIsPlaying(false)
        onVolumeChange?.(0)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } catch (error) {
      setIsPlaying(false)
    }
  }

  const stop = () => {
    if (sourceRef.current) {
      sourceRef.current.stop()
    }
    setIsPlaying(false)
    onVolumeChange?.(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  return (
    <button
      onClick={isPlaying ? stop : play}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  )
}