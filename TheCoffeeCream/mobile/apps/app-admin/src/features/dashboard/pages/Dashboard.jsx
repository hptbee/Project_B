import React, { useState, useEffect } from 'react'
import { LoadingSpinner, Skeleton } from '@thecoffeecream/ui-shared'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import RecentOrders from '../components/RecentOrders'
import { dashboardApi } from '@/shared/services/api/dashboard'
import './Dashboard.scss'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [revenueData, setRevenueData] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadDashboardData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            const [statsData, revenueChartData, ordersData] = await Promise.all([
                dashboardApi.getDashboardStats(),
                dashboardApi.getRevenueData(7),
                dashboardApi.getRecentOrders(10)
            ])

            setStats(statsData)
            setRevenueData(revenueChartData)
            setRecentOrders(ordersData)
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="dashboard-page" data-theme="dark">
                <div className="dashboard-header">
                    <Skeleton width="200px" height="32px" />
                    <Skeleton width="100px" height="40px" variant="rect" />
                </div>
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div className="glass-card" key={i} style={{ padding: '20px', height: '140px' }}>
                            <Skeleton width="40px" height="40px" variant="circle" style={{ marginBottom: '16px' }} />
                            <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="80%" height="28px" />
                        </div>
                    ))}
                </div>
                <div className="dashboard-content">
                    <div className="glass-card" style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
                        <Skeleton width="100%" height="100%" variant="rect" />
                    </div>
                    <div className="glass-card" style={{ height: '400px', width: '100%' }}>
                        <Skeleton width="150px" height="24px" style={{ marginBottom: '20px' }} />
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                <Skeleton width="40px" height="40px" variant="rect" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="40%" height="16px" style={{ marginBottom: '4px' }} />
                                    <Skeleton width="30%" height="12px" />
                                </div>
                                <Skeleton width="60px" height="20px" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-page" data-theme="dark">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button
                    className="refresh-btn"
                    onClick={() => loadDashboardData(true)}
                    disabled={refreshing}
                >
                    {refreshing ? '⟳' : '↻'} Làm mới
                </button>
            </div>

            <div className="stats-grid">
                <StatCard
                    icon="💰"
                    label="Doanh thu hôm nay"
                    value={stats?.todayRevenue || 0}
                    format="currency"
                />
                <StatCard
                    icon="📦"
                    label="Đơn hàng hôm nay"
                    value={stats?.todayOrders || 0}
                    format="number"
                />
                <StatCard
                    icon="📊"
                    label="Giá trị TB/đơn"
                    value={stats?.averageOrderValue || 0}
                    format="currency"
                />
                <StatCard
                    icon="🍰"
                    label="Sản phẩm bán"
                    value={stats?.totalProducts || 0}
                    format="number"
                />
            </div>

            <div className="dashboard-content">
                <div className="chart-section">
                    <RevenueChart data={revenueData} />
                </div>
                <div className="orders-section">
                    <RecentOrders orders={recentOrders} />
                </div>
            </div>
        </div>
    )
}
