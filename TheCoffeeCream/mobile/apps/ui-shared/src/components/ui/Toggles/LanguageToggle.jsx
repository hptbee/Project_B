import React from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'
import './Toggles.scss'

export function LanguageToggle({ className = '' }) {
    const { locale, setLocale } = useTranslation()

    return (
        <div className={`lang-switcher ${className}`}>
            <button
                type="button"
                className={`lang-btn ${locale === 'vi' ? 'active' : ''}`}
                onClick={() => setLocale('vi')}
                title="Tiếng Việt"
            >
                🇻🇳
            </button>
            <button
                type="button"
                className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                onClick={() => setLocale('en')}
                title="English"
            >
                🇺🇸
            </button>
        </div>
    )
}
