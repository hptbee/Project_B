import React from 'react'
import { useTranslation } from '../../../contexts/LanguageContext'
import './LoadingSpinner.scss'

export function LoadingSpinner({ fullScreen = false, message }) {
    const { t } = useTranslation()
    const displayMessage = message || t('common.loading')
    if (fullScreen) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <div className="spinner-message">{displayMessage}</div>
                </div>
            </div>
        )
    }

    return <div className="spinner"></div>
}
