import React, { useRef, useState } from 'react'
import { Button } from '../ui'

interface VRMSettingsProps {
  onVRMFileChange: (file: File | null) => void
  currentVRMName?: string
  isLoading?: boolean
}

export const VRMSettings: React.FC<VRMSettingsProps> = ({
  onVRMFileChange,
  currentVRMName,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File | null) => {
    if (!file) return

    // Check if file is VRM format
    if (!file.name.toLowerCase().endsWith('.vrm')) {
      alert('VRMファイルを選択してください（.vrm拡張子）')
      return
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます（50MB以下にしてください）')
      return
    }

    onVRMFileChange(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const resetToDefault = () => {
    onVRMFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
        VRMキャラクター
      </h3>

      <div style={{
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
      }}>
        現在のキャラクター: {currentVRMName || 'デフォルト'}
      </div>

      {/* File upload area */}
      <div
        style={{
          border: `2px dashed ${dragActive ? '#007AFF' : '#ddd'}`,
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(0, 122, 255, 0.1)' : 'rgba(248, 249, 250, 0.8)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '16px'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={{
          fontSize: '24px',
          marginBottom: '8px',
          color: dragActive ? '#007AFF' : '#999'
        }}>
          📁
        </div>
        <div style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '4px'
        }}>
          {isLoading ? 'VRMファイルを読み込み中...' : 'VRMファイルをドラッグ&ドロップ'}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#666'
        }}>
          またはクリックしてファイルを選択
        </div>
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginTop: '8px'
        }}>
          対応形式: .vrm（最大50MB）
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".vrm"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={isLoading}
      />

      {/* Reset button */}
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          ファイルを選択
        </Button>

        <Button
          onClick={resetToDefault}
          disabled={isLoading}
          style={{
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          デフォルトに戻す
        </Button>
      </div>
    </div>
  )
}