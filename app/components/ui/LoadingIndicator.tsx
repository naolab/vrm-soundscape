import React from 'react'

interface LoadingIndicatorProps {
  message?: string
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = React.memo(({ 
  message = '読み込み中...' 
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#666',
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      {message}
    </div>
  )
})