import React from 'react'
import './Badge.scss'

/**
 * Reusable Badge component for status, categories, and labels
 * @param {string} variant - success, warning, danger, primary, info, draft
 * @param {string} size - sm, md
 * @param {boolean} pill - circular corners
 * @param {React.ReactNode} children - label content
 */
const Badge = ({
    variant = 'primary',
    size = 'md',
    pill = true,
    className = '',
    children
}) => {
    const classes = [
        'app-badge',
        `variant-${variant}`,
        `size-${size}`,
        pill ? 'is-pill' : '',
        className
    ].filter(Boolean).join(' ')

    return (
        <span className={classes}>
            {children}
        </span>
    )
}

export default Badge
