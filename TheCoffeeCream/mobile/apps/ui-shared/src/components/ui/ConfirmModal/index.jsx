import { useTranslation } from '../../../contexts/LanguageContext'
import './ConfirmModal.scss'

export function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    type = 'default' // 'default', 'danger'
}) {
    const { t } = useTranslation()
    if (!show) return null

    const displayConfirm = confirmText || t('action.confirm')
    const displayCancel = cancelText || t('action.cancel')

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    {onCancel && (
                        <button className="btn-secondary" onClick={onCancel}>
                            {displayCancel}
                        </button>
                    )}
                    <button
                        className={`btn-primary ${type === 'danger' ? 'danger' : ''}`}
                        onClick={onConfirm}
                    >
                        {displayConfirm}
                    </button>
                </div>
            </div>
        </div>
    )
}
