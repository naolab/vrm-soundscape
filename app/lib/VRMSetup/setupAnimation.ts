import * as THREE from 'three'
import { VRM } from '@pixiv/three-vrm'
import { loadVRMAnimation } from '../VRMAnimation/loadVRMAnimation'
import { VRM_CONFIG } from '../../constants/vrm'

export async function setupAnimation(
  vrm: VRM,
  mixer: THREE.AnimationMixer,
  modelUrl: string
): Promise<void> {
  // Load animation based on current model
  const animationUrl = modelUrl === VRM_CONFIG.DEFAULT_MODEL_PATH
    ? '/animations/idle_01.vrma'
    : '/animations/idle_02.vrma'

  const clip = await loadVRMAnimation(animationUrl, vrm)
  if (clip) {
    const action = mixer.clipAction(clip)
    action.setLoop(THREE.LoopRepeat, Infinity)
    action.play()
  }
}