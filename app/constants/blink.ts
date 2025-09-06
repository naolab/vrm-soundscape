// Auto blink animation constants based on ChatVRM implementation
export const BLINK_CONFIG = {
  // 瞬きで目を閉じている時間(sec)
  CLOSE_DURATION: 0.12,
  
  // 瞬きで目を開いている時間(sec)
  OPEN_DURATION: 5.0,
  
  // ブレンドシェイプ名
  EXPRESSION_NAME: 'blink' as const
} as const