import React, { useRef, useEffect } from 'react'
import Icon from './Icon'

export default function SearchBar({ value, onChange, placeholder = 'Tìm sản phẩm...', autoFocus = false }) {
    const ref = useRef(null)
    useEffect(() => { if (autoFocus && ref.current) ref.current.focus() }, [autoFocus])
    return (
        <div className="search-bar">
            <Icon name="search" size={18} className="search-icon" />
            <input ref={ref} value={value} onChange={e => onChange(e.target.value)} className="search-input" placeholder={placeholder} />
            {value && <button className="search-clear" onClick={() => onChange('')}>✕</button>}
        </div>
    )
}
