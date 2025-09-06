import { VRMExpressionManager } from '@pixiv/three-vrm'
import { BLINK_CONFIG } from '../../constants/blink'

export class AutoBlink {
  private expressionManager: VRMExpressionManager
  private remainingTime: number = 0
  private isOpen: boolean = true
  private isEnabled: boolean = true

  constructor(expressionManager: VRMExpressionManager) {
    this.expressionManager = expressionManager
    this.remainingTime = BLINK_CONFIG.OPEN_DURATION
  }

  /**
   * 瞬きアニメーションを更新
   * @param deltaTime フレーム間の経過時間（秒）
   */
  public update(deltaTime: number): void {
    if (!this.isEnabled || !this.expressionManager) {
      return
    }

    // 残り時間を減らす
    if (this.remainingTime > 0) {
      this.remainingTime -= deltaTime
      return
    }

    // 目が開いている場合は閉じる
    if (this.isOpen) {
      this.close()
    } else {
      // 目が閉じている場合は開く
      this.open()
    }
  }

  /**
   * 瞬きを無効化（他の表情アニメーションの際に使用）
   */
  public disable(): void {
    this.isEnabled = false
    // 目を開いた状態にリセット
    if (this.expressionManager) {
      this.expressionManager.setValue(BLINK_CONFIG.EXPRESSION_NAME, 0)
    }
    this.isOpen = true
  }

  /**
   * 瞬きを有効化
   */
  public enable(): void {
    this.isEnabled = true
    this.remainingTime = BLINK_CONFIG.OPEN_DURATION
  }

  /**
   * 目を閉じる
   */
  private close(): void {
    this.isOpen = false
    this.remainingTime = BLINK_CONFIG.CLOSE_DURATION
    this.expressionManager.setValue(BLINK_CONFIG.EXPRESSION_NAME, 1.0)
  }

  /**
   * 目を開く
   */
  private open(): void {
    this.isOpen = true
    this.remainingTime = BLINK_CONFIG.OPEN_DURATION
    this.expressionManager.setValue(BLINK_CONFIG.EXPRESSION_NAME, 0.0)
  }

  /**
   * 瞬きの状態を取得
   */
  public getBlinkState(): { isOpen: boolean; isEnabled: boolean } {
    return {
      isOpen: this.isOpen,
      isEnabled: this.isEnabled
    }
  }
}