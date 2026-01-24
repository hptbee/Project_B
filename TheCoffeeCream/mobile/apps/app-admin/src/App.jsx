import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CoreProvider } from '@/shared/contexts/CoreProvider'
import { SideMenu } from '@thecoffeecream/ui-shared'
import AppRoutes from './routes'
import logo from './assets/icons/logo.png' // I'll check if this exists or copy it

const menuItems = [
    { to: '/', icon: 'chart', label: 'Dashboard' },
    { to: '/orders', icon: 'history', label: 'Quản lý đơn' },
]

export default function App() {
    return (
        <BrowserRouter>
            <CoreProvider>
                <SideMenu items={menuItems} logo={logo} footer="Admin v1.0.0" />
                <AppRoutes />
            </CoreProvider>
        </BrowserRouter>
    )
}
