import React from 'react'
import { Routes, Route } from 'react-router-dom'

import TableList from '@/features/tables/pages/TableList'
import ProductList from '@/features/products/pages/ProductList'
import ProductDetail from '@/features/products/pages/ProductDetail'
import Cart from '@/features/cart/Cart'
import TableOrder from '@/features/tables/pages/TableOrder'
import Checkout from '@/features/checkout/pages/Checkout'
import EndOfDayReport from '@/features/reports/pages/EndOfDayReport'
import Help from '@/features/menu/pages/Help'
import KitchenNotifications from '@/features/menu/pages/KitchenNotifications'
import Language from '@/features/menu/pages/Language'
import Logout from '@/features/menu/pages/Logout'
import OrderHistory from '@/features/orders/pages/OrderHistory'
import OrderDetail from '@/features/orders/pages/OrderDetail'
import PaymentRequests from '@/features/menu/pages/PaymentRequests'
import Receipts from '@/features/menu/pages/Receipts'
import Settings from '@/features/menu/pages/Settings'
import Support from '@/features/menu/pages/Support'
import SyncData from '@/features/menu/pages/SyncData'
import Terms from '@/features/menu/pages/Terms'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TableList />} />
            <Route path="/table/:tableId" element={<TableOrder />} />
            <Route path="/checkout/:tableId" element={<Checkout />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sync" element={<SyncData />} />
            <Route path="/kitchen" element={<KitchenNotifications />} />
            <Route path="/requests" element={<PaymentRequests />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/report" element={<EndOfDayReport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/support" element={<Support />} />
            <Route path="/lang" element={<Language />} />
            <Route path="/logout" element={<Logout />} />
        </Routes>
    )
}
