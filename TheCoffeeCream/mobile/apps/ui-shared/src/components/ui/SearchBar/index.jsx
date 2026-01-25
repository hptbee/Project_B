import { useRef, useEffect } from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'
import { Icon } from '../Icon'

export function SearchBar({ value, onChange, placeholder, autoFocus = false }) {
    const { t } = useTranslation()
    const displayPlaceholder = placeholder || t('common.search')
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
                placeholder={displayPlaceholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
