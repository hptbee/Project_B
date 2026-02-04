import { Icon } from '../Icon'
import './Toast.css'

export function Toast({ message, visible, type = 'success', action }) {
    return (
        <div className={`app-toast ${visible ? 'visible' : ''} type-${type}`} role="status" aria-live="polite">
            <div className="toast-inner">
                <Icon name={type === 'error' ? 'alert-circle' : 'check'} size={20} className="toast-check-icon" />
                <div className="toast-msg">{message}</div>
                {action && (
                    <button
                        className="toast-action-btn"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    )
}
