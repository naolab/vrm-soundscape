export type Theme = 'blue' | 'green' | 'orange' | 'pink' | 'purple'

export interface ThemeOption {
  value: Theme
  color: string
}

export interface SettingsState {
  showSettings: boolean
  currentTheme: Theme
}