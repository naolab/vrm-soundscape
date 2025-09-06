'use client'

import React, { useRef, useEffect, useState } from 'react'
import { VRM_CONFIG } from '../constants/vrm'

interface VRMViewerProps {
  modelPath?: string
}

export const VRMViewer: React.FC<VRMViewerProps> = ({ 
  modelPath = VRM_CONFIG.DEFAULT_MODEL_PATH 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // コンポーネントがマウントされたことを記録
    setIsMounted(true)

    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return

    let cleanup: (() => void) | null = null

    const initVRM = async () => {
      if (!canvasRef.current) return

      try {
        // 動的インポートでThree.jsを読み込み
        const THREE = await import('three')
        const { VRMLoaderPlugin } = await import('@pixiv/three-vrm')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')

        // Three.js setup
        const scene = new THREE.Scene()

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
          VRM_CONFIG.CAMERA.FOV,
          window.innerWidth / window.innerHeight,
          VRM_CONFIG.CAMERA.NEAR,
          VRM_CONFIG.CAMERA.FAR
        )
        camera.position.set(
          VRM_CONFIG.CAMERA.POSITION.X,
          VRM_CONFIG.CAMERA.POSITION.Y,
          VRM_CONFIG.CAMERA.POSITION.Z
        )

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // Lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, VRM_CONFIG.LIGHTING.DIRECTIONAL.INTENSITY)
        directionalLight.position.set(
          VRM_CONFIG.LIGHTING.DIRECTIONAL.POSITION.X,
          VRM_CONFIG.LIGHTING.DIRECTIONAL.POSITION.Y,
          VRM_CONFIG.LIGHTING.DIRECTIONAL.POSITION.Z
        ).normalize()
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const ambientLight = new THREE.AmbientLight(0xffffff, VRM_CONFIG.LIGHTING.AMBIENT.INTENSITY)
        scene.add(ambientLight)

        // Load VRM
        const loader = new GLTFLoader()
        loader.register((parser: any) => new VRMLoaderPlugin(parser))

        let vrm: any = null
        const clock = new THREE.Clock()

        loader.load(
          modelPath,
          (gltf: any) => {
            vrm = gltf.userData.vrm
            
            // Disable frustum culling for better performance
            vrm.scene.traverse((obj: any) => {
              obj.frustumCulled = false
            })

            scene.add(vrm.scene)
            setIsLoaded(true)
          },
          undefined, // Remove progress logging for cleaner console
          (error: any) => {
            console.error('Failed to load VRM:', error)
            setError('VRMファイルの読み込みに失敗しました')
          }
        )

        // Animation loop
        let animationId: number
        const animate = () => {
          animationId = requestAnimationFrame(animate)
          
          const deltaTime = clock.getDelta()
          
          if (vrm) {
            vrm.update(deltaTime)
          }
          
          renderer.render(scene, camera)
        }
        animate()

        // Handle resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }
        
        window.addEventListener('resize', handleResize)

        // Final cleanup function
        cleanup = () => {
          window.removeEventListener('resize', handleResize)
          cancelAnimationFrame(animationId)
          renderer.dispose()
        }

      } catch (err) {
        console.error('VRM initialization error:', err)
        setError('VRMの初期化に失敗しました')
      }
    }

    initVRM()

    return () => {
      if (cleanup) cleanup()
    }
  }, [modelPath])

  // SSRとクライアントサイドで同じ内容をレンダリング
  if (!isMounted) {
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    )
  }

  return (
    <>
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'red',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}
      
      {!isLoaded && !error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          VRMキャラクター読み込み中...
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </>
  )
}