import { cacheService, CACHE_KEYS } from '@/shared/services/cache/cacheService'

export default function EndOfDayReport() {
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

                const response = await fetch(`/api/Reports/products?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
                const data = await response.json()

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

    if (loading && !report) return <LoadingSpinner fullScreen message="Đang tải báo cáo..." />

    if (error) return <div className="page"><header className="page-header"><button className="back" onClick={() => navigate(-1)} aria-label="Quay lại"><IconChevron variant="bold" /></button><h2>Báo cáo cuối ngày</h2></header><div className="page-content">Lỗi: {error}</div></div>

    const hasData = report && report.orderCount > 0

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Báo cáo cuối ngày</h2>
            </header>

            <div className="report-controls">
                <div className="report-tabs">
                    <button
                        className={`tab-button ${selectedTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('summary')}
                    >
                        Tổng hợp
                    </button>
                    <button
                        className={`tab-button ${selectedTab === 'products' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('products')}
                    >
                        Hàng hóa
                    </button>
                </div>
                <button
                    className="date-picker-button"
                    onClick={() => setShowDatePicker(true)}
                >
                    {(() => {
                        const date = new Date(selectedDate)
                        const day = date.getDate()
                        const month = date.getMonth() + 1
                        const year = date.getFullYear()
                        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
                    })()} ▼
                </button>
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
                                    <div className="card-title">Sản phẩm (Ly)</div>
                                    <div className="card-value">{report.regularCupCount}</div>
                                </div>
                                <div className="report-card">
                                    <div className="card-title">Topping</div>
                                    <div className="card-value">{report.toppingCount}</div>
                                </div>
                            </div>

                            <div className="report-card">
                                <div className="card-title">Tổng doanh thu</div>
                                <div className="card-value primary">{report.totalRevenue.toLocaleString()} đ</div>

                                <div className="payment-details">
                                    <div className="row">
                                        <span className="label">Tiền mặt:</span>
                                        <span className="val">{report.cashRevenue.toLocaleString()} đ</span>
                                    </div>
                                    <div className="row">
                                        <span className="label">Chuyển khoản:</span>
                                        <span className="val">{report.transferRevenue.toLocaleString()} đ</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="report-card clickable-card"
                                onClick={() => navigate(`/orders?date=${selectedDate}&status=SUCCESS`)}
                            >
                                <div>
                                    <div className="card-title">Tổng số đơn hàng</div>
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
                                        <div className="header-title">HÀNG HÓA BÁN RA</div>
                                        <div className="header-summary">
                                            <span>Tổng</span>
                                            <span>{productSales.reduce((sum, p) => sum + (p?.quantitySold || 0), 0)}</span>
                                            <span>{productSales.reduce((sum, p) => sum + (p?.revenue || 0), 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {productSales.length === 0 ? (
                                        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                            Không có dữ liệu sản phẩm
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

            {showDatePicker && (
                <div className="datepicker-overlay" onClick={() => setShowDatePicker(false)}>
                    <div className="datepicker-modal" onClick={e => e.stopPropagation()}>
                        <div className="datepicker-header">
                            <h3>Chọn thời gian</h3>
                            <button onClick={() => setShowDatePicker(false)}>✕</button>
                        </div>
                        <DatePicker
                            selected={new Date(selectedDate)}
                            onChange={(date) => {
                                const year = date.getFullYear()
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const day = String(date.getDate()).padStart(2, '0')
                                setSelectedDate(`${year}-${month}-${day}`)
                                setShowDatePicker(false)
                            }}
                            inline
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            yearDropdownItemNumber={10}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
