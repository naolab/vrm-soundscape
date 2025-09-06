import React, { CSSProperties } from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  style?: CSSProperties
  className?: string
}

export const Button: React.FC<ButtonProps> = React.memo(({ 
  onClick, 
  children, 
  style, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={className}
    >
      {children}
    </button>
  )
})