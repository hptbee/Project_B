import React from 'react'
import { Icon } from '../Icon'
import './Toast.scss'

export function Toast({ message, visible, type = 'success' }) {
    return (
        <div className={`app-toast ${visible ? 'visible' : ''} type-${type}`} role="status" aria-live="polite">
            <div className="toast-inner">
                <Icon name="check" size={20} className="toast-check-icon" />
                <div className="toast-msg">{message}</div>
            </div>
        </div>
    )
}
