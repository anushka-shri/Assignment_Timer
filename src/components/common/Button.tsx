import React from 'react';
import { cn } from '../../utils/classname';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const buttonStyles = cn(
    'font-medium rounded-md transition-colors',
    variant === 'primary'
      ? 'text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
      : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg'
    },
    disabled && 'cursor-not-allowed',
    className
  );

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
