// 口パク関連の定数設定
export const LIP_SYNC_CONFIG = {
  // 口パク音量設定
  VOLUME_MULTIPLIER: 0.5,           // 口の動きを50%に制限（ChatVRM方式）
  SMOOTHING_FACTOR: 0.25,           // 口の動きのスムージング係数
  
  // 音声制御設定
  DEFAULT_MASTER_VOLUME: 0.5,       // デフォルトマスター音量
  VOLUME_TRANSITION_TIME: 0.05,     // 音量変化の遷移時間（秒）
  
  // パフォーマンス最適化設定
  PERFORMANCE: {
    UPDATE_INTERVAL: 3,             // Nフレームごとに更新
    DISTANCE_THRESHOLD: 0.01        // 距離変化の検出閾値
  }
} as const