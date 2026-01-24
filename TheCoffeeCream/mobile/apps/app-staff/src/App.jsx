import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './styles.scss'
import { CartProvider } from '@/shared/contexts/CartContext'
import { UIProvider } from '@/shared/contexts/UIContext'
import SideMenu from '@/shared/components/layout/SideMenu'
import { ProductProvider } from '@/shared/contexts/ProductContext'
import AppRoutes from './routes'

import { App as CapacitorApp } from '@capacitor/app';
import { Dialog } from '@capacitor/dialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { OfflineQueue } from '@/shared/services/offline/offlineQueue';
import { ordersApi } from '@/shared/services/api/orders';
import { Logger } from '@/shared/services/api/logger';

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();

    // Background Sync for Offline Orders
    useEffect(() => {
        const handleSync = async () => {
            Logger.info('[NETWORK] Device is online. Attempting to sync offline queue...');
            await OfflineQueue.processQueue(async (orderData) => {
                // We use the original API service to send the order
                // Note: We bypass the ordersApi.createOrder wrapper here to avoid 
                // re-adding it to the queue if it fails again (it's already in the queue)
                const { apiFetch } = await import('@/shared/services/api/client');
                return apiFetch('/Orders', {
                    method: 'POST',
                    body: JSON.stringify(orderData)
                });
            });
        };

        window.addEventListener('online', handleSync);

        // Initial check on mount
        if (navigator.onLine) {
            handleSync();
        }

        return () => window.removeEventListener('online', handleSync);
    }, []);

    useEffect(() => {
        const backListener = CapacitorApp.addListener('backButton', async ({ canGoBack }) => {
            if (location.pathname === '/' || location.pathname === '/home' || location.pathname === '/login') {
                const { value } = await Dialog.confirm({
                    title: 'Exit App',
                    message: 'Are you sure you want to exit?',
                    okButtonTitle: 'Exit',
                    cancelButtonTitle: 'Cancel'
                });

                if (value) {
                    CapacitorApp.exitApp();
                }
            } else {
                navigate(-1);
            }
        });

        return () => {
            backListener.then(handler => handler.remove());
        };
    }, [navigate, location]);

    return (
        <CartProvider>
            <UIProvider>
                <ProductProvider>
                    <SideMenu />
                    <AppRoutes />
                </ProductProvider>
            </UIProvider>
        </CartProvider>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}
