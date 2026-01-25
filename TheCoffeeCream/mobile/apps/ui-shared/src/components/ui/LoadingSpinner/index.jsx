import { useTranslation } from '../../../contexts/LanguageContext'
import { Icon } from '../Icon'
import './LoadingSpinner.scss'

export function LoadingSpinner({ fullScreen = false, message }) {
    const { t } = useTranslation()
    const displayMessage = message || t('common.loading')
    const content = (
        <div className="spinner-wrapper">
            <div className="spinner"></div>
            <div className="spinner-logo">
                <img src="/src/assets/icons/logo.png" alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
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
