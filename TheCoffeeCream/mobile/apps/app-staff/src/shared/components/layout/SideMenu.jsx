import React, { useState } from 'react'
import { useMenu, useToast, SideMenu as SharedSideMenu } from '@thecoffeecream/ui-shared'
import { useProducts } from '@/shared/contexts/ProductContext'
import logo from '@/assets/icons/logo.png'

const menuItems = [
    { to: '/', icon: 'menu', label: 'Bảng bàn' },
    { to: '/orders?status=SUCCESS', icon: 'history', label: 'Lịch sử' },
    { to: '/report', icon: 'chart', label: 'Báo cáo' },
]

export default function SideMenu() {
    const { syncProducts } = useProducts()
    const { showToast } = useToast()
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        if (syncing) return
        setSyncing(true)
        try {
            await syncProducts()
            showToast('Đã đồng bộ thực đơn mới!')
        } catch (error) {
            showToast('Lỗi: ' + error.message)
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
