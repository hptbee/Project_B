import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reportApi } from '@/shared/services/api/report'
import { LoadingSpinner, Icon, Badge, DateRangePicker, useTranslation } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './Insights.scss'

export default function Insights() {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [revenueData, setRevenueData] = useState([])
    const [productSales, setProductSales] = useState([])
    const [paymentData, setPaymentData] = useState([])
    const getInitialDateRange = () => {
        const today = new Date()
        const day = today.getDay()
        const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)

        const monday = new Date(today.getFullYear(), today.getMonth(), diffToMonday)
        const sunday = new Date(today.getFullYear(), today.getMonth(), diffToMonday + 6)

        const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

        return {
            start: format(monday),
            end: format(sunday)
        }
    }

    const [dateRange, setDateRange] = useState(getInitialDateRange())

    const fetchReports = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)

        // URL encode the date strings to ensure the '+' in the offset (+07:00) is correctly transmitted
        const startWithTime = encodeURIComponent(`${dateRange.start}T00:00:00+07:00`)
        const endWithTime = encodeURIComponent(`${dateRange.end}T23:59:59+07:00`)

        try {
            const [rev, prod, pay] = await Promise.all([
                reportApi.getRevenueReport(startWithTime, endWithTime, 'day'),
                reportApi.getProductReport(startWithTime, endWithTime),
                reportApi.getPaymentReport(startWithTime, endWithTime)
            ])
            setRevenueData(rev)
            setProductSales(prod)
            setPaymentData(pay)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [dateRange])

    const totalRevenue = revenueData.reduce((sum, item) => sum + (item.netRevenue ?? item.NetRevenue ?? 0), 0)
    const totalOrders = revenueData.reduce((sum, item) => sum + (item.orderCount ?? item.OrderCount ?? 0), 0)

    if (loading && revenueData.length === 0) return <LoadingSpinner fullScreen message={t('report.sales_report') + '...'} />

    return (
        <div className="insights-page">
            <header className="page-header">
                <div className="title-section">
                    <h1 className="dashboard-title">{t('report.sales_report')}</h1>
                </div>
                <div className="header-actions">
                    <div className="header-controls-row">
                        <DateRangePicker
                            start={dateRange.start}
                            end={dateRange.end}
                            onApply={(range) => {
                                const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                                const start = format(range.start)
                                const end = format(range.end)
                                setDateRange({ start, end })
                            }}
                        />
                        <button
                            className={`refresh-btn ${refreshing ? 'loading' : ''}`}
                            onClick={() => fetchReports(true)}
                            disabled={refreshing}
                        >
                            <Icon name="sync" size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="stats-cards">
                <Link to="/orders" className="stat-card glass-card clickable">
                    <div className="icon-box purple"><Icon name="dollar-sign" /></div>
                    <div className="stat-info">
                        <span className="label">{t('report.revenue')}</span>
                        <h2 className="value">{formatPrice(totalRevenue, true)}</h2>
                        <span className="quick-link">{t('nav.menu')} <Icon name="chevronRight" size={12} /></span>
                    </div>
                </Link>
                <Link to="/orders" className="stat-card glass-card clickable">
                    <div className="icon-box amber"><Icon name="shopping-bag" /></div>
                    <div className="stat-info">
                        <span className="label">{t('report.orders')}</span>
                        <h2 className="value">{totalOrders}</h2>
                        <span className="quick-link">{t('nav.invoices')} <Icon name="chevron-right" size={12} /></span>
                    </div>
                </Link>
                <Link to="/products" className="stat-card glass-card clickable">
                    <div className="icon-box green"><Icon name="coffee" /></div>
                    <div className="stat-info">
                        <span className="label">{t('report.avg_bill')}</span>
                        <h2 className="value">{formatPrice(totalOrders > 0 ? totalRevenue / totalOrders : 0, true)}</h2>
                        <span className="quick-link">{t('nav.menu')} <Icon name="chevron-right" size={12} /></span>
                    </div>
                </Link>
            </div>

            <div className="insights-grid">
                <section className="chart-section glass-card">
                    <h3 className="section-title">{t('common.revenue_trend')}</h3>
                    <div className="revenue-chart">
                        {(() => {
                            const days = []
                            const startParts = dateRange.start.split('-').map(Number)
                            const endParts = dateRange.end.split('-').map(Number)

                            const start = new Date(startParts[0], startParts[1] - 1, startParts[2])
                            const end = new Date(endParts[0], endParts[1] - 1, endParts[2])
                            let current = new Date(start)

                            const safeRevenueData = Array.isArray(revenueData) ? revenueData : []

                            while (current <= end) {
                                const y = current.getFullYear()
                                const m = String(current.getMonth() + 1).padStart(2, '0')
                                const d = String(current.getDate()).padStart(2, '0')
                                const dateStr = `${y}-${m}-${d}`

                                // Use more resilient property naming and matching
                                const dataItem = safeRevenueData.find(item => {
                                    const p = (item.period || item.Period || '').toString()
                                    return p === dateStr || p.startsWith(dateStr)
                                })

                                const netRevenueValue = dataItem ? (dataItem.netRevenue ?? dataItem.NetRevenue ?? 0) : 0
                                days.push({ period: dateStr, netRevenue: netRevenueValue })
                                current.setDate(current.getDate() + 1)
                            }

                            const max = Math.max(...days.map(d => d.netRevenue)) || 1

                            return days.map((item, idx) => {
                                const rawHeight = (item.netRevenue / max) * 100
                                const height = item.netRevenue > 0 ? Math.max(rawHeight, 10) : 0
                                return (
                                    <div key={idx} className="chart-bar-wrapper">
                                        <div className="bar" style={{ height: `${height}%` }}>
                                            <div className="tooltip">
                                                {item.period}<br />
                                                {formatPrice(item.netRevenue, true)}
                                            </div>
                                        </div>
                                        <span className="bar-label">{item.period.split('-')[2]}</span>
                                    </div>
                                )
                            })
                        })()}
                    </div>
                </section>

                <section className="product-report-section glass-card full-width">
                    <h3 className="section-title">{t('report.by_item')}</h3>
                    <div className="report-table-wrapper">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>{t('form.product_name')} (Code)</th>
                                    <th>{t('pos.add_to_order')}</th>
                                    <th className="text-right">{t('report.quantity')}</th>
                                    <th className="text-right">{t('report.revenue')}</th>
                                    <th className="text-right">{t('report.revenue')} (Net)</th>
                                </tr>
                                <tr className="summary-row">
                                    <td colSpan="2">{t('modal.total_items')}: {productSales.length}</td>
                                    <td className="text-right">{productSales.reduce((s, p) => s + p.quantitySold, 0)}</td>
                                    <td className="text-right">{formatPrice(productSales.reduce((s, p) => s + p.revenue, 0), true)}</td>
                                    <td className="text-right text-highlight">{formatPrice(productSales.reduce((s, p) => s + p.revenue, 0), true)}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {productSales.sort((a, b) => b.revenue - a.revenue).map((p, idx) => (
                                    <tr key={idx}>
                                        <td className="code">SP-{idx.toString().padStart(5, '0')}</td>
                                        <td className="name">{p.productName}</td>
                                        <td className="text-right qty">{p.quantitySold}</td>
                                        <td className="text-right rev">{formatPrice(p.revenue, true)}</td>
                                        <td className="text-right net">{formatPrice(p.revenue, true)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="top-products glass-card">
                    <h3 className="section-title">{t('common.top_products')}</h3>
                    <div className="product-sales-list">
                        {productSales.slice(0, 10).map((p, idx) => (
                            <div key={idx} className="product-sale-item">
                                <div className="rank">#{idx + 1}</div>
                                <div className="info">
                                    <span className="name">{p.productName}</span>
                                    <span className="category">{p.category}</span>
                                </div>
                                <div className="metrics">
                                    <span className="qty">{p.quantitySold} {t('pos.qty').toLowerCase()}</span>
                                    <span className="rev">{formatPrice(p.revenue, true)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="payment-breakdown glass-card">
                    <h3 className="section-title">{t('common.by_payment_method')}</h3>
                    <div className="payment-list">
                        {paymentData.map((p, idx) => (
                            <div key={idx} className="payment-item">
                                <div className="payment-info">
                                    <span className="method">{p.paymentMethod}</span>
                                    <span className="count">{p.orderCount} {t('nav.orders').toLowerCase()}</span>
                                </div>
                                <div className="payment-bar-bg">
                                    <div
                                        className="payment-bar"
                                        style={{ width: `${(p.revenue / (totalRevenue || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="payment-value">{formatPrice(p.revenue, true)}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
