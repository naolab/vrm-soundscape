import * as THREE from 'three'
import { VRM } from '@pixiv/three-vrm'

export function setupMaterials(vrm: VRM): void {
  // Setup outline materials
  vrm.scene.traverse((child) => {
    if ((child as any).isMesh) {
      const mesh = child as THREE.Mesh
      
      // Ensure proper rendering for transparent materials
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => {
            if (mat.transparent) {
              mat.depthWrite = false
              mat.side = THREE.DoubleSide
            }
          })
        } else {
          if (mesh.material.transparent) {
            mesh.material.depthWrite = false
            mesh.material.side = THREE.DoubleSide
          }
        }
      }
    }
  })
}