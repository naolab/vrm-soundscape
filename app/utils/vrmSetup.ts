import { VRMModel } from '../types/vrm'

/**
 * VRMモデルの基本セットアップを行う
 * @param vrm VRMモデルインスタンス
 */
export const setupVRMModel = (vrm: VRMModel): void => {
  // Disable frustum culling for better performance
  vrm.scene.traverse((obj) => {
    obj.frustumCulled = false
  })
}

/**
 * VRMモデルにexpression managerが存在するかチェック
 * @param vrm VRMモデルインスタンス
 * @returns expression managerの有無
 */
export const hasExpressionManager = (vrm: VRMModel): vrm is VRMModel & { expressionManager: NonNullable<VRMModel['expressionManager']> } => {
  return vrm.expressionManager !== undefined
}