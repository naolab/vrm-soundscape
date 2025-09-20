import React from 'react'
import { colors, spacing, borderRadius, typography, transitions } from '../../styles/design-system'

interface FormFieldProps {
  label?: string
  children: React.ReactNode
  error?: string
  required?: boolean
  description?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  required = false,
  description
}) => {
  const fieldStyles: React.CSSProperties = {
    marginBottom: spacing[4]
  }

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing[2]
  }

  const requiredStyles: React.CSSProperties = {
    color: colors.error[500],
    marginLeft: spacing[1]
  }

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm[0],
    color: colors.text.secondary,
    marginTop: spacing[1]
  }

  const errorStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm[0],
    color: colors.error[500],
    marginTop: spacing[1]
  }

  return (
    <div style={fieldStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={requiredStyles}>*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <div style={descriptionStyles}>{description}</div>
      )}
      {error && (
        <div style={errorStyles}>{error}</div>
      )}
    </div>
  )
}

// Input コンポーネント
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullWidth?: boolean
}

export const Input: React.FC<InputProps> = ({
  error = false,
  fullWidth = true,
  style,
  ...props
}) => {
  const inputStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1].lineHeight,
    border: `1px solid ${error ? colors.error[500] : colors.border.medium}`,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    transition: `border-color ${transitions.duration['200']} ${transitions.timing.out}, box-shadow ${transitions.duration['200']} ${transitions.timing.out}`,
    outline: 'none',
    fontFamily: typography.fontFamily.sans,
    ...style
  }

  const focusStyles: React.CSSProperties = {
    borderColor: error ? colors.error[500] : colors.primary[500],
    boxShadow: `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
  }

  return (
    <input
      {...props}
      style={inputStyles}
      onFocus={(e) => {
        Object.assign(e.target.style, focusStyles)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? colors.error[500] : colors.border.medium
        e.target.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
    />
  )
}

// Select コンポーネント
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({
  error = false,
  fullWidth = true,
  style,
  children,
  ...props
}) => {
  const selectStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1].lineHeight,
    border: `1px solid ${error ? colors.error[500] : colors.border.medium}`,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    transition: `border-color ${transitions.duration['200']} ${transitions.timing.out}, box-shadow ${transitions.duration['200']} ${transitions.timing.out}`,
    outline: 'none',
    fontFamily: typography.fontFamily.sans,
    cursor: 'pointer',
    ...style
  }

  const focusStyles: React.CSSProperties = {
    borderColor: error ? colors.error[500] : colors.primary[500],
    boxShadow: `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
  }

  return (
    <select
      {...props}
      style={selectStyles}
      onFocus={(e) => {
        Object.assign(e.target.style, focusStyles)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? colors.error[500] : colors.border.medium
        e.target.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
    >
      {children}
    </select>
  )
}

// Slider コンポーネント
interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
}

export const Slider: React.FC<SliderProps> = ({
  label,
  showValue = true,
  formatValue = (value) => value.toString(),
  value,
  style,
  ...props
}) => {
  const containerStyles: React.CSSProperties = {
    width: '100%'
  }

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2]
  }

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm[0],
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary
  }

  const valueStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm[0],
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.mono
  }

  const sliderStyles: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: borderRadius.full,
    background: colors.gray[200],
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    ...style
  }

  return (
    <div style={containerStyles}>
      {(label || showValue) && (
        <div style={headerStyles}>
          {label && <span style={labelStyles}>{label}</span>}
          {showValue && value !== undefined && (
            <span style={valueStyles}>{formatValue(Number(value))}</span>
          )}
        </div>
      )}
      <input
        {...props}
        type="range"
        value={value}
        style={sliderStyles}
      />
    </div>
  )
}