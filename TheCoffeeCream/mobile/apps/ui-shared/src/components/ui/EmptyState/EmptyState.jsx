import { Icon } from '../Icon';
import './EmptyState.scss';

export function EmptyState({
    icon = 'search',
    title = 'No data found',
    subtitle = 'Please try again with different criteria',
    action,
    variant = 'glass'
}) {
    return (
        <div className={`empty-state-container variant-${variant}`}>
            <div className="empty-state-content">
                <div className="empty-icon-wrapper">
                    <div className="floating-animation">
                        <Icon name={icon} size={80} className="empty-icon" />
                    </div>
                </div>
                <h3 className="empty-title">{title}</h3>
                <p className="empty-subtitle">{subtitle}</p>
                {action && (
                    <div className="empty-action">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
