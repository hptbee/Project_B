import { useTranslation } from '@thecoffeecream/ui-shared'
import './RevenueChart.scss'

export default function RevenueChart({ data }) {
    const { t } = useTranslation()

    if (!data || data.length === 0) {
        return <div className="revenue-chart-empty">{t('common.no_data')}</div>
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue))

    return (
        <div className="revenue-chart">
            <h3 className="chart-title">{t('dashboard.revenue_7_days')}</h3>
            <div className="chart-container">
                {data.map((item, index) => {
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                    const date = new Date(item.date)
                    const dayLabel = date.toLocaleDateString('vi-VN', { weekday: 'short' })

                    return (
                        <div key={index} className="chart-bar-wrapper">
                            <div className="chart-bar-container">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${height}%` }}
                                    title={`${item.revenue.toLocaleString('vi-VN')} đ`}
                                >
                                    <span className="bar-value">
                                        {item.revenue > 0 ? `${(item.revenue / 1000000).toFixed(1)}M` : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="chart-label">{dayLabel}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
