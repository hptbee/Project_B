import React from 'react'
import './IconChevron.scss'

export default function IconChevron({ direction = 'left', size = 20, className = '' }) {
    const isRight = direction === 'right'
    // SVG fallback
    const transform = isRight ? 'scaleX(-1)' : undefined
    return (
        <svg
            className={`icon-chevron ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform }}
            aria-hidden="true"
            focusable="false"
        >
            <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
    )
}
