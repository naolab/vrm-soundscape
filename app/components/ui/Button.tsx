import React, { CSSProperties } from 'react'
import { colors, spacing, borderRadius, shadows, typography, transitions } from '../../styles/design-system'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  style?: CSSProperties
  className?: string
  fullWidth?: boolean
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean): CSSProperties => {
  const baseStyles: CSSProperties = {
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: typography.fontWeight.medium,
    transition: `all ${transitions.duration['200']} ${transitions.timing.out}`,
    opacity: disabled ? 0.6 : 1,
    outline: 'none'
  }

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: disabled ? colors.gray[400] : colors.primary[500],
        color: colors.text.inverse,
        boxShadow: disabled ? 'none' : shadows.sm,
      }

    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: disabled ? colors.gray[200] : colors.gray[100],
        color: disabled ? colors.gray[400] : colors.text.primary,
        boxShadow: disabled ? 'none' : shadows.sm
      }

    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: disabled ? colors.gray[400] : colors.primary[500],
        border: `1px solid ${disabled ? colors.gray[300] : colors.primary[500]}`
      }

    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: disabled ? colors.gray[400] : colors.text.primary
      }

    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: disabled ? colors.gray[400] : colors.error[500],
        color: colors.text.inverse,
        boxShadow: disabled ? 'none' : shadows.sm
      }

    default:
      return baseStyles
  }
}

const getSizeStyles = (size: ButtonSize): CSSProperties => {
  switch (size) {
    case 'sm':
      return {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm[0],
        lineHeight: typography.fontSize.sm[1].lineHeight,
        borderRadius: borderRadius.md
      }

    case 'md':
      return {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base[0],
        lineHeight: typography.fontSize.base[1].lineHeight,
        borderRadius: borderRadius.md
      }

    case 'lg':
      return {
        padding: `${spacing[4]} ${spacing[6]}`,
        fontSize: typography.fontSize.lg[0],
        lineHeight: typography.fontSize.lg[1].lineHeight,
        borderRadius: borderRadius.lg
      }

    default:
      return {}
  }
}

export const Button: React.FC<ButtonProps> = React.memo(({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  className,
  fullWidth = false
}) => {
  const variantStyles = getVariantStyles(variant as ButtonVariant, disabled)
  const sizeStyles = getSizeStyles(size as ButtonSize)

  const buttonStyles: CSSProperties = {
    ...variantStyles,
    ...sizeStyles,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: typography.fontFamily.sans,
    ...style
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={buttonStyles}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  )
})