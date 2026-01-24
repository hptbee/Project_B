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

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();

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
