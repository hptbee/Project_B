import React from 'react'
import './LoadingSpinner.scss'

export default function LoadingSpinner({ fullScreen = false, message = 'Đang xử lý...' }) {
    if (fullScreen) {
        return (
            <div className="spinner-overlay">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <div className="spinner-message">{message}</div>
                </div>
            </div>
        )
    }

    return <div className="spinner"></div>
}
