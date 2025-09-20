import { useState, useCallback, useEffect } from 'react'

/**
 * 型安全なLocalStorage操作を提供するカスタムフック
 *
 * @param key LocalStorageのキー
 * @param defaultValue デフォルト値
 * @returns [値, setter関数, リセット関数]
 */
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void, () => void] => {
  // 初期値を取得する関数
  const getInitialValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error)
    }

    return defaultValue
  }, [key, defaultValue])

  const [value, setValue] = useState<T>(getInitialValue)

  // LocalStorageに保存する関数
  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue)

    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error)
    }
  }, [key])

  // 値をデフォルトにリセットする関数
  const resetValue = useCallback(() => {
    setValue(defaultValue)

    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
    }
  }, [key, defaultValue])

  // マウント時に値を読み込み
  useEffect(() => {
    setValue(getInitialValue())
  }, [getInitialValue])

  return [value, setStoredValue, resetValue]
}

/**
 * 複数の設定値を一括で管理するためのフック
 *
 * @param key LocalStorageのキー
 * @param defaultSettings デフォルト設定オブジェクト
 * @returns [設定オブジェクト, 更新関数, リセット関数]
 */
export const useLocalStorageSettings = <T extends Record<string, any>>(
  key: string,
  defaultSettings: T
): [T, (updates: Partial<T>) => void, () => void] => {
  const [settings, setSettings, resetSettings] = useLocalStorage(key, defaultSettings)

  // 部分的な更新を行う関数
  const updateSettings = useCallback((updates: Partial<T>) => {
    setSettings({ ...settings, ...updates })
  }, [setSettings, settings])

  return [settings, updateSettings, resetSettings]
}