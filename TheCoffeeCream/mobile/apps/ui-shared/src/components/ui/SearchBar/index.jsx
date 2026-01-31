import { useRef, useEffect } from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'
import { Icon } from '../Icon'
import './SearchBar.scss'

export function SearchBar({ value, onChange, placeholder, autoFocus = false }) {
    const { t } = useTranslation()
    const displayPlaceholder = placeholder || t('common.search')
    const ref = useRef(null)

    useEffect(() => {
        if (autoFocus && ref.current) {
            ref.current.focus()
        }
    }, [autoFocus])

    const handleClear = () => {
        if (onChange) {
            onChange({ target: { value: '' } });
        }
    };

    return (
        <div className="search-bar">
            {/* Search Icon */}
            <div className="search-icon-wrapper">
                <Icon name="search" size={20} color="var(--text-muted)" />
            </div>

            {/* Input */}
            <input
                ref={ref}
                type="text"
                className="search-input"
                placeholder={displayPlaceholder}
                value={value}
                onChange={onChange}
            />

            {/* Clear Button */}
            {value && (
                <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClear}
                    title={t('action.clear')}
                >
                    <Icon name="x" size={16} color="var(--text-muted)" />
                    <span className="sr-only">Clear</span>
                </button>
            )}
        </div>
    )
}
