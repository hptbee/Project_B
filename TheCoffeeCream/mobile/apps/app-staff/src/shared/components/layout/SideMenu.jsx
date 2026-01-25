import { useState } from 'react'
import { useToast, SideMenu as SharedSideMenu, useTranslation, ordersApi, reportsApi, cacheService, CACHE_KEYS } from '@thecoffeecream/ui-shared'
import { useProducts } from '@/shared/contexts/ProductContext'
import logo from '@/assets/icons/logo.png'

export default function SideMenu() {
    const { t } = useTranslation()
    const { syncProducts } = useProducts()
    const { showToast } = useToast()
    const [syncing, setSyncing] = useState(false)

    const menuItems = [
        { to: '/', icon: 'menu', label: t('nav.floorplan') },
        { to: '/orders?status=SUCCESS', icon: 'history', label: t('nav.history') },
        { to: '/report', icon: 'chart', label: t('nav.shift_report') },
    ]

    const handleSync = async () => {
        if (syncing) return
        setSyncing(true)
        try {
            // 1. Sync Menu (Products & Categories) via Context
            await syncProducts()

            // 2. Sync Today's Orders & Report for offline usage
            const today = new Date().toISOString().split('T')[0]

            const [orders, report] = await Promise.all([
                ordersApi.getOrders(today, today),
                reportsApi.getDailyReport(today)
            ])

            // Cache data
            cacheService.set(CACHE_KEYS.ORDERS, orders)
            cacheService.set(CACHE_KEYS.REPORT, report)

            showToast('Đã đồng bộ dữ liệu (Menu, Đơn hàng, Báo cáo)!')
        } catch (error) {
            console.error('Sync error:', error)
            showToast(t('modal.sync_error') + ': ' + (error.message || 'Unknown error'))
        } finally {
            setSyncing(false)
        }
    }

    return (
        <SharedSideMenu
            items={menuItems}
            logo={logo}
            footer="Staff v2.0.0"
            onSync={handleSync}
            isSyncing={syncing}
        />
    )
}
