import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import '@/styles/components.scss'

export default function Toast({ message, visible }) {
    return (
        <div className={`app-toast ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
            <div className="toast-inner">
                <FiCheckCircle size={20} className="toast-check-icon" />
                <div className="toast-msg">{message}</div>
            </div>
        </div>
    )
}
