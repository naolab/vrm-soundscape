import React from 'react'
import { colors, spacing } from '../../styles/design-system'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = '読み込み中...'
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '24px'
      case 'md': return '40px'
      case 'lg': return '56px'
      default: return '40px'
    }
  }

  const spinnerSize = getSize()

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[4]
  }

  const spinnerStyles: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `3px solid ${colors.gray[200]}`,
    borderTop: `3px solid ${colors.primary[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }

  const messageStyles: React.CSSProperties = {
    color: colors.text.secondary,
    fontSize: '14px',
    fontWeight: '500'
  }

  return (
    <div style={containerStyles}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyles} />
      {message && <div style={messageStyles}>{message}</div>}
    </div>
  )
}