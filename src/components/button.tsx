import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'cancel';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    primary:
        'bg-primary-light text-white hover:bg-primary-hover disabled:bg-primary-disabled disabled:text-gray-400 dark:bg-primary-dark dark:hover:bg-primary-hover dark:disabled:bg-gray-700',
    secondary:
        'bg-secondary-light text-gray-800 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-secondary-dark dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400',
    cancel: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200 disabled:text-red-400 dark:bg-red-600 dark:hover:bg-red-700 dark:disabled:bg-red-800 dark:disabled:text-gray-300',
};
export default function Button({
    loading = false,
    variant = 'primary',
    leftIcon,
    rightIcon,
    children,
    disabled,
    className = '',
    onClick,
    ...props
}: ButtonProps) {
    const spinnerColor = variant === 'secondary' ? 'text-gray-800' : 'text-white';

    return (
        <button
            {...props}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
        relative flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium
        transition-colors
        ${variantClasses[variant] || variantClasses['primary']}
        ${className}
      `}
        >
            {loading && <Loader2 className={`absolute left-3 h-4 w-4 animate-spin ${spinnerColor}`} />}
            {leftIcon && (
                <span className={`flex items-center ${loading ? 'opacity-0' : 'opacity-100'}`}>{leftIcon}</span>
            )}
            <span className={`${loading ? 'opacity-0' : 'opacity-100'} flex items-center`}>{children}</span>
            {rightIcon && (
                <span className={`flex items-center ${loading ? 'opacity-0' : 'opacity-100'}`}>{rightIcon}</span>
            )}
        </button>
    );
}
