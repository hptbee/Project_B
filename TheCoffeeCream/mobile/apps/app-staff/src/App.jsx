import React, { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Dialog } from '@capacitor/dialog'

import './styles.scss'
import { CartProvider } from '@/shared/contexts/CartContext'
import { UIProvider } from '@/shared/contexts/UIContext'
import { ProductProvider } from '@/shared/contexts/ProductContext'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'
import SideMenu from '@/shared/components/layout/SideMenu'
import AppRoutes from './routes'

import { OfflineQueue } from '@/shared/services/offline/offlineQueue'
import { Logger } from '@/shared/services/api/logger'

function AppContent() {
    const navigate = useNavigate()
    const location = useLocation()

    // Background Sync for Offline Orders
    useEffect(() => {
        const handleSync = async () => {
            if (!navigator.onLine) return

            const queueItems = OfflineQueue.getQueue()
            if (queueItems.length === 0) return

            Logger.info(`[NETWORK] Online - Syncing ${queueItems.length} items from queue...`)
            await OfflineQueue.processQueue(async (orderData) => {
                const { apiFetch } = await import('@/shared/services/api/client')
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

    // Capacitor Hardware Back Button
    useEffect(() => {
        const backListener = CapacitorApp.addListener('backButton', async () => {
            const isRootPath = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/login'
            if (isRootPath) {
                const { value } = await Dialog.confirm({
                    title: 'Thoát ứng dụng',
                    message: 'Bạn có chắc chắn muốn thoát?',
                    okButtonTitle: 'Thoát',
                    cancelButtonTitle: 'Hủy'
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
    }, [navigate, location])

    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <UIProvider>
                        <ProductProvider>
                            <SideMenu />
                            <AppRoutes />
                        </ProductProvider>
                    </UIProvider>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}
