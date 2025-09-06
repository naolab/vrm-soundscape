'use client'

import React, { useRef, useEffect, useState } from 'react'
import { VRM_CONFIG } from '../constants/vrm'
import { AutoBlink } from '../features/animation/AutoBlink'
import { VRMModel, VRMLoadResult } from '../types/vrm'
import { setupVRMModel, hasExpressionManager } from '../utils/vrmSetup'
import { loadVRMAnimation } from '../lib/VRMAnimation/loadVRMAnimation'
import { AutoLookAt } from '../features/emoteController/autoLookAt'

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

        // Load VRM with LookAtSmoother plugin
        const { VRMLookAtSmootherLoaderPlugin } = await import('../lib/VRMLookAtSmoother/VRMLookAtSmootherLoaderPlugin')
        
        const loader = new GLTFLoader()
        loader.register((parser: any) => new VRMLoaderPlugin(parser, {
          lookAtPlugin: new VRMLookAtSmootherLoaderPlugin(parser),
        }))

        let vrm: VRMModel | null = null
        let autoBlink: AutoBlink | null = null
        let autoLookAt: AutoLookAt | null = null
        let mixer: THREE.AnimationMixer | null = null
        const clock = new THREE.Clock()

        loader.load(
          modelPath,
          async (gltf: VRMLoadResult) => {
            vrm = gltf.userData.vrm
            
            // Setup VRM model
            setupVRMModel(vrm)

            // Initialize auto blink if expressionManager exists
            if (hasExpressionManager(vrm)) {
              autoBlink = new AutoBlink(vrm.expressionManager)
            }

            // Initialize auto look-at system
            autoLookAt = new AutoLookAt(vrm, camera)

            // Initialize animation mixer
            mixer = new THREE.AnimationMixer(vrm.scene)

            scene.add(vrm.scene)

            // Load idle animation
            try {
              const idleAnimation = await loadVRMAnimation('/idle_loop.vrma')
              if (idleAnimation) {
                const clip = idleAnimation.createAnimationClip(vrm)
                const action = mixer.clipAction(clip)
                action.setLoop(THREE.LoopRepeat, Infinity)
                action.play()
              }
            } catch (error) {
              console.warn('Could not load idle animation:', error)
            }

            setIsLoaded(true)
          },
          undefined, // Remove progress logging for cleaner console
          (error: unknown) => {
            console.error('Failed to load VRM:', error)
            setError('VRMファイルの読み込みに失敗しました')
          }
        )

        // Animation loop
        let animationId: number
        const animate = () => {
          animationId = requestAnimationFrame(animate)
          
          const deltaTime = clock.getDelta()
          
          // Update animation mixer first
          if (mixer) {
            mixer.update(deltaTime)
          }
          
          // Update VRM and auto blink
          if (vrm) {
            vrm.update(deltaTime)
          }
          
          if (autoBlink) {
            autoBlink.update(deltaTime)
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
          if (mixer) {
            mixer.stopAllAction()
          }
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