import { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Dialog } from '@capacitor/dialog'

import './styles.scss'
import { CoreProvider } from '@/shared/contexts/CoreProvider'
import { useCartDispatch } from '@/shared/contexts/CartContext'
import SideMenu from '@/shared/components/layout/SideMenu'
import AppRoutes from './routes'

import { OfflineQueue, Logger, useTranslation, ordersApi, reportsApi, cacheService, CACHE_KEYS } from '@thecoffeecream/ui-shared'

/**
 * Main application content with route and global effect logic
 */
function AppContent() {
    const { t } = useTranslation() // Hook now works because CoreProvider is parent
    const navigate = useNavigate()
    const location = useLocation()
    const cartDispatch = useCartDispatch()

    // Background Sync (Push & Pull)
    useEffect(() => {
        const handleSync = async () => {
            if (!navigator.onLine) return

            // Check if we have a token
            if (!localStorage.getItem('auth_token')) return

            Logger.info('[SYNC] Network online. Starting background sync...')

            // 1. PUSH: Process Offline Queue (Outgoing)
            const queueItems = OfflineQueue.getQueue()
            if (queueItems.length > 0) {
                Logger.info(`[SYNC] Pushing ${queueItems.length} offline orders...`)
                await OfflineQueue.processQueue(async (orderData) => {
                    const { apiFetch } = await import('@thecoffeecream/ui-shared')
                    return apiFetch('/Orders', {
                        method: 'POST',
                        body: JSON.stringify(orderData)
                    })
                })
            }

            // 2. PULL: Fetch Latest Data (Incoming)
            try {
                const today = new Date().toLocaleDateString('en-CA')

                // Fetch in parallel
                // getOrders with status=DRAFT to sync shared tables? 
                // We'll trust ordersApi.getOrders returns all status or we need params?
                // Previously: api.getOrders(targetDate, null, null) returned all.

                const [orders, report] = await Promise.all([
                    ordersApi.getOrders(today, today),
                    reportsApi.getDailyReport(today)
                ])

                // Update Cache
                if (orders) {
                    cacheService.set(CACHE_KEYS.ORDERS, orders)

                    // NEW: Sync Drafts to CartContext
                    // We need dispatch from CartContext. But wait, AppContent is OUTSIDE CartProvider?
                    // No, AppContent is inside CoreProvider -> CartProvider. So we can useCartDispatch!

                    // We need to import useCartDispatch inside the component to use it.
                    // But we can't add hooks conditionally or in callbacks.
                }
                if (report) cacheService.set(CACHE_KEYS.REPORT, report)

                // Trigger event for components to listen if needed, or we just rely on cache?
                // For Drafts, we want to update the ACTIVE cart state in RAM, not just cache.
                // So we need to dispatch actions.
                // However, doing this from App global effect might impact performance if we dispatch too often.
                // Let's fire a CustomEvent 'drafts-updated' and let TableOrder or another listener handle it?
                // Or better: use the hook.

                window.dispatchEvent(new CustomEvent('data-refreshed', { detail: { orders } }))

                Logger.info('[SYNC] Background data pull complete.')
            } catch (error) {
                Logger.warn('[SYNC] Background pull failed (non-critical):', error)
            }
        }

        window.addEventListener('online', handleSync)
        window.addEventListener('trigger-sync', handleSync)

        // Sync every 60 seconds
        const interval = setInterval(handleSync, 60 * 1000)

        // Initial sync on mount
        handleSync()

        return () => {
            window.removeEventListener('online', handleSync)
            window.removeEventListener('trigger-sync', handleSync)
            clearInterval(interval)
        }
    }, [])

    // Listen for data-refreshed to sync drafts into CartContext
    useEffect(() => {
        const handleDataRefreshed = (e) => {
            const orders = e.detail?.orders || []
            const drafts = orders.filter(o => o.status === 'DRAFT' && o.tableNumber > 0)

            drafts.forEach(draft => {
                // Determine tableId from draft.tableNumber
                // Dispatch update
                cartDispatch({
                    type: 'SYNC_DRAFT_FROM_SERVER',
                    payload: { tableId: String(draft.tableNumber), order: draft }
                })
            })
        }

        window.addEventListener('data-refreshed', handleDataRefreshed)
        return () => window.removeEventListener('data-refreshed', handleDataRefreshed)
    }, [cartDispatch])

    // Capacitor Hardware Back Button Support
    useEffect(() => {
        const backListener = CapacitorApp.addListener('backButton', async () => {
            const isRootPath = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/login'

            if (isRootPath) {
                const { value } = await Dialog.confirm({
                    title: t('app.exit_title'),
                    message: t('app.exit_confirm'),
                    okButtonTitle: t('app.exit_ok'),
                    cancelButtonTitle: t('app.exit_cancel')
                })

                if (value) {
                    CapacitorApp.exitApp()
                }
            } else {
                navigate(-1)
            }
        })

        return () => {
            backListener.then(handler => handler.remove())
        }
    }, [navigate, location, t])

    return (
        <>
            <SideMenu />
            <AppRoutes />
        </>
    )
}

export default function App() {
    return (
        <CoreProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </CoreProvider>
    )
}
