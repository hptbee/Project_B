import React from 'react';
import { Icon } from '../Icon';
import './Button.scss';

export const Button = ({
    children,
    variant = 'primary', // primary, secondary, outline, danger, ghost
    size = 'md', // sm, md, lg
    icon,
    disabled = false,
    loading = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClass = `btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`;
    
    return (
        <button
            type={type}
            className={baseClass.trim()}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : icon ? (
                <span className="btn-icon">
                    <Icon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
                </span>
            ) : null}
            {children && <span className="btn-text">{children}</span>}
        </button>
    );
};
