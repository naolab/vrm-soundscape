import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LipSync } from '../lib/LipSync'

export function useDistanceVolumeControl(
  lipSyncRef: React.RefObject<LipSync | null>,
  isPlaying: boolean,
  camera?: THREE.PerspectiveCamera,
  characterPosition?: THREE.Vector3
) {
  const animationFrameRef = useRef<number>()
  const lastDistanceRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  
  useEffect(() => {
    if (!isPlaying || !lipSyncRef.current || !camera || !characterPosition) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
      return
    }

    // Optimized distance monitoring - only check every 3rd frame for performance
    const updateDistance = () => {
      if (!isPlaying || !lipSyncRef.current || !camera || !characterPosition) {
        return
      }

      frameCountRef.current++
      
      // Only calculate distance every 3rd frame (20fps instead of 60fps)
      if (frameCountRef.current % 3 === 0) {
        const distance = camera.position.distanceTo(characterPosition)
        
        // Only update volume if distance changed significantly (optimization)
        if (Math.abs(distance - lastDistanceRef.current) > 0.01) {
          lipSyncRef.current.setVolumeByDistance(distance)
          lastDistanceRef.current = distance
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updateDistance)
    }

    updateDistance()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = undefined
      }
    }
  }, [lipSyncRef, isPlaying, camera, characterPosition])
}