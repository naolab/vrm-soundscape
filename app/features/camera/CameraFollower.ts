import * as THREE from 'three'
import { VRM } from '@pixiv/three-vrm'

/**
 * カメラ追従機能を管理するクラス
 */
export class CameraFollower {
  private vrm: VRM
  private camera: THREE.Camera
  private enabled: boolean = false

  constructor(vrm: VRM, camera: THREE.Camera) {
    this.vrm = vrm
    this.camera = camera
  }

  /**
   * カメラ追従の有効/無効を設定
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * カメラ追従の更新処理
   */
  public update(): void {
    if (!this.enabled) return

    const cameraPosition = this.camera.position
    const characterPosition = this.vrm.scene.position
    
    // カメラの少し手前を向くように調整（最大0.4ラジアン = 約23度）
    const maxOffsetAngle = 0.4
    
    // Calculate angle to camera (only Y-axis rotation)
    const angle = Math.atan2(
      cameraPosition.x - characterPosition.x,
      cameraPosition.z - characterPosition.z
    )
    
    // スムーズなオフセット計算（angleに比例して徐々に変化）
    // angleが0に近いほどオフセットも小さくなる
    const smoothOffset = Math.sin(angle) * maxOffsetAngle
    
    // Apply rotation to character with smooth offset
    const adjustedAngle = angle + smoothOffset
    this.vrm.scene.rotation.y = adjustedAngle
  }
}