export interface AudioFile {
  id: string
  name: string
  url: string
  duration?: number
  size: number
}

export interface AudioFileUploadProps {
  audioFiles: AudioFile[]
  maxFiles: number
  onAudioFilesChange: (files: AudioFile[]) => void
  onPlayAudio?: (audioFile: AudioFile) => void
  isPlaying?: string | null // Audio file ID that's currently playing
}