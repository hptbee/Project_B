import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@thecoffeecream/ui-shared'

// Pages
import Login from '@/features/auth/pages/Login'
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

/**
 * ProtectedRoute component - redirects to /login if not authenticated
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute><TableList /></ProtectedRoute>} />
            <Route path="/table/:tableId" element={<ProtectedRoute><TableOrder /></ProtectedRoute>} />
            <Route path="/checkout/:tableId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/sync" element={<ProtectedRoute><SyncData /></ProtectedRoute>} />
            <Route path="/kitchen" element={<ProtectedRoute><KitchenNotifications /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><PaymentRequests /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><EndOfDayReport /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/lang" element={<ProtectedRoute><Language /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
        </Routes>
    )
}
