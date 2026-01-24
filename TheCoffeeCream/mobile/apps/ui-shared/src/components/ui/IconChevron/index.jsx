import React from 'react'
import './IconChevron.scss'

export function IconChevron({ direction = 'left', size = 20, className = '' }) {
    const isRight = direction === 'right'
    const isDown = direction === 'down'
    const isUp = direction === 'up'

    let transform = undefined
    if (isRight) transform = 'scaleX(-1)'
    if (isDown) transform = 'rotate(-90deg)'
    if (isUp) transform = 'rotate(90deg)'

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
