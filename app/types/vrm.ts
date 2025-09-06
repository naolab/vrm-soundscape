import { VRM, VRMExpressionManager } from '@pixiv/three-vrm'

export interface VRMModel extends VRM {
  expressionManager?: VRMExpressionManager
}

export interface VRMLoadResult {
  userData: {
    vrm: VRMModel
  }
}