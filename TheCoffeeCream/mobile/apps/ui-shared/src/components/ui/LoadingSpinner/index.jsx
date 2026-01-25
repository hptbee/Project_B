import { useTranslation } from '../../../contexts/LanguageContext'

import logo from '../../../assets/icons/logo.png'
import './LoadingSpinner.scss'

export function LoadingSpinner({ fullScreen = false, message }) {
    const { t } = useTranslation()
    const displayMessage = message || t('common.loading')
    const content = (
        <div className="spinner-wrapper">
            <div className="spinner"></div>
            <div className="spinner-logo">
                <img src={logo} alt="Logo" />
            </div>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-container">
                    {content}
                    <div className="spinner-message">{displayMessage}</div>
                </div>
            </div>
        )
    }

    return content
}
