import React, { useRef, useEffect } from 'react'
import { Icon } from '../Icon'

export function SearchBar({ value, onChange, placeholder = 'Tìm sản phẩm...', autoFocus = false }) {
    const ref = useRef(null)

    useEffect(() => {
        if (autoFocus && ref.current) {
            ref.current.focus()
        }
    }, [autoFocus])

    return (
        <div className="search-bar">
            <Icon name="search" size={20} color="var(--text-muted)" />
            <input
                ref={ref}
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
