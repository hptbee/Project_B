import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './styles.scss'
import { CartProvider } from '@/shared/contexts/CartContext'
import { UIProvider } from '@/shared/contexts/UIContext'
import SideMenu from '@/shared/components/layout/SideMenu'
import { ProductProvider } from '@/shared/contexts/ProductContext'
import AppRoutes from './routes'

export default function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <UIProvider>
                    <ProductProvider>
                        <SideMenu />
                        <AppRoutes />
                    </ProductProvider>
                </UIProvider>
            </CartProvider>
        </BrowserRouter>
    )
}
