import React, { useState } from 'react'
import { useMenu, useToast, SideMenu as SharedSideMenu, useTranslation } from '@thecoffeecream/ui-shared'
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
            await syncProducts()
            showToast(t('modal.sync_success'))
        } catch (error) {
            showToast(t('modal.sync_error') + ': ' + error.message)
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
