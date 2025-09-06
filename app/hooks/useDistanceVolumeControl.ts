import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LipSync } from '../lib/LipSync'

export function useDistanceVolumeControl(
  lipSyncRef: React.RefObject<LipSync | null>,
  isPlaying: boolean,
  camera?: THREE.Camera,
  characterPosition?: THREE.Vector3
) {
  const animationFrameRef = useRef<number>()
  
  useEffect(() => {
    if (!isPlaying || !lipSyncRef.current || !camera || !characterPosition) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    let lastDistance = 0

    // Real-time distance monitoring using requestAnimationFrame
    const updateDistance = () => {
      if (!isPlaying || !lipSyncRef.current || !camera || !characterPosition) {
        return
      }

      const distance = camera.position.distanceTo(characterPosition)
      
      // Only update volume if distance changed significantly (optimization)
      if (Math.abs(distance - lastDistance) > 0.01) {
        lipSyncRef.current.setVolumeByDistance(distance)
        lastDistance = distance
      }
      
      animationFrameRef.current = requestAnimationFrame(updateDistance)
    }

    updateDistance()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [lipSyncRef, isPlaying, camera, characterPosition])
}