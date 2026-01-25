import React from 'react';
import './StatCard.scss';

/**
 * StatCard component for displaying key metrics with icons and trends.
 */
export const StatCard = ({ icon, label, value, format = 'number', trend, trendValue }) => {
    const formatValue = (val) => {
        if (format === 'currency') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(val);
        }
        if (format === 'percentage') {
            return `${val}%`;
        }
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    return (
        <div className="stat-card glass-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{formatValue(value)}</div>
                {trend && (
                    <div className={`stat-trend ${trend}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </div>
                )}
            </div>
        </div>
    );
};
