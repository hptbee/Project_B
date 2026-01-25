import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { LoadingSpinner, DatePicker, useTranslation, apiFetch, IconChevron, cacheService, CACHE_KEYS, reportsApi as api } from '@thecoffeecream/ui-shared'
import './EndOfDayReport.scss'

export default function EndOfDayReport() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedTab, setSelectedTab] = useState('summary')
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    })
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [productSales, setProductSales] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false)
    const dateButtonRef = useRef(null)
    const modalRef = useRef(null)
    const closeBtnRef = useRef(null)

    useEffect(() => {
        const fetchReport = async () => {
            const todayStr = new Date().toLocaleDateString('en-CA')
            const isToday = selectedDate === todayStr

            try {
                if (isToday) {
                    const cached = cacheService.get(CACHE_KEYS.REPORT)
                    if (cached) {
                        setReport(cached)
                        setLoading(false)
                    }
                } else {
                    setLoading(true)
                }

                const data = await api.getDailyReport(selectedDate)
                setReport(data)
                if (isToday) cacheService.set(CACHE_KEYS.REPORT, data, 10 * 60 * 1000) // 10m cache
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReport()
    }, [selectedDate])

    useEffect(() => {
        const fetchProductSales = async () => {
            if (selectedTab !== 'products') return

            try {
                setLoadingProducts(true)
                const startDate = new Date(selectedDate)
                startDate.setHours(0, 0, 0, 0)
                const endDate = new Date(selectedDate)
                endDate.setHours(23, 59, 59, 999)

                const data = await apiFetch(`/Reports/products?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)

                const sorted = (data || []).sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                setProductSales(sorted)
            } catch (err) {
                console.error('Failed to fetch product sales:', err)
                setProductSales([])
            } finally {
                setLoadingProducts(false)
            }
        }
        fetchProductSales()
    }, [selectedTab, selectedDate])

    useEffect(() => {
        if (!showDatePicker) return

        const prevActive = document.activeElement
        // focus first meaningful control
        setTimeout(() => closeBtnRef.current?.focus(), 0)

        const onKey = (e) => {
            if (e.key === 'Escape') {
                setShowDatePicker(false)
                return
            }

            if (e.key === 'Tab') {
                const container = modalRef.current
                if (!container) return
                const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                if (!focusable || focusable.length === 0) return
                const first = focusable[0]
                const last = focusable[focusable.length - 1]
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault()
                    last.focus()
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault()
                    first.focus()
                }
            }
        }

        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            // return focus
            try { prevActive?.focus?.() } catch { }
        }
    }, [showDatePicker])

    if (loading && !report) return <LoadingSpinner fullScreen message={t('common.loading')} />

    if (error) return <div className="page"><header className="page-header"><button className="back" onClick={() => navigate(-1)} aria-label={t('action.cancel')}><IconChevron variant="bold" /></button><h2>{t('report.daily_report')}</h2></header><div className="page-content">{t('common.error')}: {error}</div></div>

    const hasData = report && report.orderCount > 0

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label={t('action.cancel')}>
                    <IconChevron variant="bold" />
                </button>
                <h2>{t('report.daily_report')}</h2>
            </header>

            <div className="report-controls">
                <div className="report-tabs">
                    <button
                        className={`tab-button ${selectedTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('summary')}
                    >
                        {t('report.summary')}
                    </button>
                    <button
                        className={`tab-button ${selectedTab === 'products' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('products')}
                    >
                        {t('report.goods')}
                    </button>
                </div>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        setSelectedDate(`${year}-${month}-${day}`)
                    }}
                    label="Chọn thời gian"
                />
            </div>

            {!hasData ? (
                <div className="report-container">
                    <div className="empty-state">
                        <h3>Chưa có dữ liệu nào cho ngày này.</h3>
                        <p>Hãy hoàn thành các đơn hàng để xem báo cáo.</p>
                    </div>
                </div>
            ) : (
                <>
                    {selectedTab === 'summary' && (
                        <div className="report-container">
                            <div className="report-grid">
                                <div className="report-card">
                                    <div className="card-title">{t('report.product_count')}</div>
                                    <div className="card-value">{report.regularCupCount}</div>
                                </div>
                                <div className="report-card">
                                    <div className="card-title">{t('report.topping_count')}</div>
                                    <div className="card-value">{report.toppingCount}</div>
                                </div>
                            </div>

                            <div className="report-card">
                                <div className="card-title">{t('report.total_revenue')}</div>
                                <div className="card-value primary">{report.totalRevenue.toLocaleString()} đ</div>

                                <div className="payment-details">
                                    <div className="row">
                                        <span className="label">{t('report.cash_label')}</span>
                                        <span className="val">{report.cashRevenue.toLocaleString()} đ</span>
                                    </div>
                                    <div className="row">
                                        <span className="label">{t('report.transfer_label')}</span>
                                        <span className="val">{report.transferRevenue.toLocaleString()} đ</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="report-card clickable-card"
                                onClick={() => navigate(`/orders?date=${selectedDate}&status=SUCCESS`)}
                            >
                                <div>
                                    <div className="card-title">{t('report.total_orders')}</div>
                                    <div className="card-value">{report.orderCount}</div>
                                </div>
                                <div className="arrow"><IconChevron direction="right" variant="bold" /></div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'products' && (
                        <div className="report-container">
                            {loadingProducts ? (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Đang tải...</div>
                            ) : (
                                <div className="product-sales-list">
                                    <div className="product-sales-header">
                                        <div className="header-title">{t('report.sold_goods')}</div>
                                        <div className="header-summary">
                                            <span>{t('report.total')}</span>
                                            <span>{productSales.reduce((sum, p) => sum + (p?.quantitySold || 0), 0)}</span>
                                            <span>{productSales.reduce((sum, p) => sum + (p?.revenue || 0), 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {productSales.length === 0 ? (
                                        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                            {t('common.no_data')}
                                        </div>
                                    ) : (
                                        productSales.map((product, idx) => (
                                            <div key={idx} className="product-item">
                                                <div className="product-name">{product?.productName || 'N/A'}</div>
                                                <div className="product-quantity">{product?.quantitySold || 0}</div>
                                                <div className="product-revenue">{(product?.revenue || 0).toLocaleString()}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}



        </div>
    )
}
