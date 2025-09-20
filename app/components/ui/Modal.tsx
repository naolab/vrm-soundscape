import React, { useEffect, useCallback } from 'react'
import { colors, spacing, borderRadius, shadows, zIndex, transitions } from '../../styles/design-system'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const getSizeStyles = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  switch (size) {
    case 'sm':
      return {
        width: '400px',
        maxWidth: '90vw'
      }
    case 'md':
      return {
        width: '500px',
        maxWidth: '90vw'
      }
    case 'lg':
      return {
        width: '700px',
        maxWidth: '90vw'
      }
    case 'xl':
      return {
        width: '900px',
        maxWidth: '95vw'
      }
    default:
      return {
        width: '500px',
        maxWidth: '90vw'
      }
  }
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  // ESCキーでモーダルを閉じる
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose()
    }
  }, [closeOnEscape, onClose])

  // オーバーレイクリックでモーダルを閉じる
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }, [closeOnOverlayClick, onClose])

  useEffect(() => {
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, closeOnEscape, handleKeyDown])

  // body のスクロールを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeStyles = getSizeStyles(size)

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: zIndex.modal,
    padding: spacing[4]
  }

  const modalStyles: React.CSSProperties = {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xl,
    ...sizeStyles,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const headerStyles: React.CSSProperties = {
    padding: `${spacing[6]} ${spacing[6]} ${spacing[4]} ${spacing[6]}`,
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  }

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.text.primary
  }

  const contentStyles: React.CSSProperties = {
    padding: spacing[6],
    overflow: 'auto',
    flex: 1
  }

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: colors.text.secondary,
    padding: spacing[1],
    borderRadius: borderRadius.md,
    transition: `color ${transitions.duration['200']} ${transitions.timing.out}`
  }

  return (
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div style={modalStyles}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                onClick={onClose}
                aria-label="Close modal"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.secondary
                }}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </div>
  )
}

// モーダルフッター用のコンポーネント
interface ModalFooterProps {
  children: React.ReactNode
  justify?: 'start' | 'center' | 'end' | 'between'
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  justify = 'end'
}) => {
  const getJustifyContent = () => {
    switch (justify) {
      case 'start': return 'flex-start'
      case 'center': return 'center'
      case 'end': return 'flex-end'
      case 'between': return 'space-between'
      default: return 'flex-end'
    }
  }

  const footerStyles: React.CSSProperties = {
    padding: `${spacing[4]} ${spacing[6]} ${spacing[6]} ${spacing[6]}`,
    borderTop: `1px solid ${colors.border.light}`,
    display: 'flex',
    gap: spacing[3],
    justifyContent: getJustifyContent(),
    flexShrink: 0
  }

  return <div style={footerStyles}>{children}</div>
}