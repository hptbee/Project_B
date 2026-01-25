import React, { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Dialog } from '@capacitor/dialog'

import './styles.scss'
import { CoreProvider } from '@/shared/contexts/CoreProvider'
import SideMenu from '@/shared/components/layout/SideMenu'
import AppRoutes from './routes'

import { OfflineQueue } from '@/shared/services/offline/offlineQueue'
import { Logger, useTranslation } from '@thecoffeecream/ui-shared'

/**
 * Main application content with route and global effect logic
 */
function AppContent() {
    const { t } = useTranslation() // Hook now works because CoreProvider is parent
    const navigate = useNavigate()
    const location = useLocation()

    // Background Sync for Offline Orders
    useEffect(() => {
        const handleSync = async () => {
            if (!navigator.onLine) return

            // Check if we have a token before trying to sync
            if (!localStorage.getItem('auth_token')) return

            const queueItems = OfflineQueue.getQueue()
            if (queueItems.length === 0) return

            Logger.info(`[NETWORK] Online - Syncing ${queueItems.length} items from queue...`)
            await OfflineQueue.processQueue(async (orderData) => {
                const { apiFetch } = await import('@thecoffeecream/ui-shared')
                return apiFetch('/Orders', {
                    method: 'POST',
                    body: JSON.stringify(orderData)
                })
            })
        }

        window.addEventListener('online', handleSync)
        window.addEventListener('trigger-sync', handleSync)

        const interval = setInterval(() => {
            if (OfflineQueue.getQueue().length > 0) {
                handleSync()
            }
        }, 2 * 60 * 1000)

        handleSync()

        return () => {
            window.removeEventListener('online', handleSync)
            window.removeEventListener('trigger-sync', handleSync)
            clearInterval(interval)
        }
    }, [])

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
