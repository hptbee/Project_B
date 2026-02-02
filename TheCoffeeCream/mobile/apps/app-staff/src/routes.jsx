import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth, LoadingSpinner } from '@thecoffeecream/ui-shared'

// Lazy Load Pages
const Login = React.lazy(() => import('@/features/auth/pages/Login'))
const TableList = React.lazy(() => import('@/features/tables/pages/TableList'))
const ProductList = React.lazy(() => import('@/features/products/pages/ProductList'))
const ProductDetail = React.lazy(() => import('@/features/products/pages/ProductDetail'))
const Cart = React.lazy(() => import('@/features/cart/Cart'))
const TableOrder = React.lazy(() => import('@/features/tables/pages/TableOrder'))
const Checkout = React.lazy(() => import('@/features/checkout/pages/Checkout'))
const EndOfDayReport = React.lazy(() => import('@/features/reports/pages/EndOfDayReport'))
const Help = React.lazy(() => import('@/features/menu/pages/Help'))
const KitchenNotifications = React.lazy(() => import('@/features/menu/pages/KitchenNotifications'))
const Language = React.lazy(() => import('@/features/menu/pages/Language'))
const Logout = React.lazy(() => import('@/features/menu/pages/Logout'))
const OrderHistory = React.lazy(() => import('@/features/orders/pages/OrderHistory'))
const OrderDetail = React.lazy(() => import('@/features/orders/pages/OrderDetail'))
const PaymentRequests = React.lazy(() => import('@/features/menu/pages/PaymentRequests'))
const Receipts = React.lazy(() => import('@/features/menu/pages/Receipts'))
const Settings = React.lazy(() => import('@/features/menu/pages/Settings'))
const Support = React.lazy(() => import('@/features/menu/pages/Support'))
const SyncData = React.lazy(() => import('@/features/menu/pages/SyncData'))
const Terms = React.lazy(() => import('@/features/menu/pages/Terms'))

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
        <Suspense fallback={<LoadingSpinner fullScreen />}>
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
        </Suspense>
    )
}
