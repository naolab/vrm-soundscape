import React, { useRef, useState } from 'react'
import { Button } from '../ui'
import { AudioFile } from '../../types/audio'

interface AudioFileSettingsProps {
  audioFiles: AudioFile[]
  maxFiles?: number
  onAudioFilesChange: (files: AudioFile[]) => void
  onPlayAudio?: (audioFile: AudioFile) => void
  isPlaying?: string | null
}

export const AudioFileSettings: React.FC<AudioFileSettingsProps> = ({
  audioFiles,
  maxFiles = 10,
  onAudioFilesChange,
  onPlayAudio,
  isPlaying
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

  const handleFileSelect = (files: FileList) => {
    const newFiles: AudioFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check if file is audio format
      if (!file.type.startsWith('audio/')) {
        alert(`${file.name} は音声ファイルではありません`)
        continue
      }

      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert(`${file.name} のファイルサイズが大きすぎます（100MB以下にしてください）`)
        continue
      }

      // Check if we're at max capacity
      if (audioFiles.length + newFiles.length >= maxFiles) {
        alert(`音声ファイルは最大${maxFiles}個までです`)
        break
      }

      const url = URL.createObjectURL(file)
      newFiles.push({
        id: generateId(),
        name: file.name,
        url,
        size: file.size
      })
    }

    if (newFiles.length > 0) {
      onAudioFilesChange([...audioFiles, ...newFiles])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const removeAudioFile = (id: string) => {
    const updatedFiles = audioFiles.filter(file => file.id !== id)
    onAudioFilesChange(updatedFiles)

    // Clean up object URL
    const fileToRemove = audioFiles.find(file => file.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url)
    }
  }

  const clearAllFiles = () => {
    // Clean up all object URLs
    audioFiles.forEach(file => URL.revokeObjectURL(file.url))
    onAudioFilesChange([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
      }}>
        音声ファイル ({audioFiles.length}/{maxFiles})
      </h3>

      {/* File upload area */}
      <div
        style={{
          border: `2px dashed ${dragActive ? '#007AFF' : '#ddd'}`,
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(0, 122, 255, 0.1)' : 'rgba(248, 249, 250, 0.8)',
          cursor: audioFiles.length >= maxFiles ? 'not-allowed' : 'pointer',
          opacity: audioFiles.length >= maxFiles ? 0.6 : 1,
          transition: 'all 0.2s ease',
          marginBottom: '16px'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => audioFiles.length < maxFiles && fileInputRef.current?.click()}
      >
        <div style={{
          fontSize: '24px',
          marginBottom: '8px',
          color: dragActive ? '#007AFF' : '#999'
        }}>
          🎵
        </div>
        <div style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '4px'
        }}>
          {audioFiles.length >= maxFiles
            ? `最大${maxFiles}個までアップロード可能です`
            : '音声ファイルをドラッグ&ドロップ'
          }
        </div>
        {audioFiles.length < maxFiles && (
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            またはクリックしてファイルを選択
          </div>
        )}
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '8px'
        }}>
          対応形式: MP3, WAV, M4A など（最大100MB）
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={audioFiles.length >= maxFiles}
      />

      {/* Audio files list */}
      {audioFiles.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px'
          }}>
            アップロード済みファイル:
          </div>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '8px'
          }}>
            {audioFiles.map((file, index) => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: isPlaying === file.id ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  border: isPlaying === file.id ? '1px solid #007AFF' : '1px solid transparent',
                  marginBottom: index < audioFiles.length - 1 ? '4px' : '0'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {file.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onPlayAudio && (
                    <Button
                      onClick={() => onPlayAudio(file)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: isPlaying === file.id ? '#FF6B6B' : '#007AFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {isPlaying === file.id ? '停止' : '再生'}
                    </Button>
                  )}
                  <Button
                    onClick={() => removeAudioFile(file.id)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      backgroundColor: '#FF6B6B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={audioFiles.length >= maxFiles}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: audioFiles.length >= maxFiles ? '#ccc' : '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: audioFiles.length >= maxFiles ? 'not-allowed' : 'pointer'
          }}
        >
          ファイルを追加
        </Button>

        {audioFiles.length > 0 && (
          <Button
            onClick={clearAllFiles}
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#FF6B6B',
              border: '1px solid #FF6B6B',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            すべて削除
          </Button>
        )}
      </div>
    </div>
  )
}