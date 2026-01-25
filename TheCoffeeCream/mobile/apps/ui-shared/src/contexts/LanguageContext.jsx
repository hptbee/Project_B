import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations } from '../constants/translations'

const LanguageContext = createContext()

/**
 * LanguageProvider - Manages application locale and translations
 */
export function LanguageProvider({ children, initialLocale = 'vi' }) {
    const [locale, setLocale] = useState(() => {
        return localStorage.getItem('app_locale') || initialLocale
    })

    const changeLanguage = useCallback((newLocale) => {
        setLocale(newLocale)
        localStorage.setItem('app_locale', newLocale)
    }, [])

    /**
     * Translation function with support for nested keys
     * Usage: t('nav.overview')
     */
    const t = useCallback((key, params = {}) => {
        const keys = key.split('.')
        let result = translations[locale]

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k]
            } else {
                return key // Fallback to key if not found
            }
        }

        // Simple param replacement: t('hello {name}', { name: 'Admin' })
        if (typeof result === 'string') {
            Object.keys(params).forEach(p => {
                result = result.replace(`{${p}}`, params[p])
            })
        }

        return result
    }, [locale])

    const value = useMemo(() => ({
        locale,
        setLocale: changeLanguage,
        t
    }), [locale, changeLanguage, t])

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

/**
 * Hook to access translation system
 */
export function useTranslation() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useTranslation must be used within LanguageProvider')
    }
    return context
}
