import { VRM, VRMExpressionPresetName } from '@pixiv/three-vrm'
import { hasExpressionManager } from '../../utils/vrmSetup'

export function setupExpressions(vrm: VRM): void {
  if (!hasExpressionManager(vrm)) return

  // Reset all expressions
  Object.values(VRMExpressionPresetName).forEach(name => {
    vrm.expressionManager?.setValue(name, 0)
  })

  // Set initial expressions
  vrm.expressionManager?.setValue(VRMExpressionPresetName.Neutral, 0)
  vrm.expressionManager?.setValue(VRMExpressionPresetName.Blink, 0)
}