import React from 'react'
import './ConfirmModal.scss'

export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'default' // 'default', 'danger'
}) {
    if (!show) return null

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
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`btn-primary ${type === 'danger' ? 'danger' : ''}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
