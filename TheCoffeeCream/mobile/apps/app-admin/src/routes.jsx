import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth, LoadingSpinner } from '@thecoffeecream/ui-shared'

// Lazy Load Pages
const Login = React.lazy(() => import('@/features/auth/pages/Login'))
const Logout = React.lazy(() => import('@/features/auth/pages/Logout'))
const Insights = React.lazy(() => import('@/features/dashboard/pages/Insights'))
const OrderList = React.lazy(() => import('@/features/orders/pages/OrderList'))
const UserList = React.lazy(() => import('@/features/users/pages/UserList'))
const ProductList = React.lazy(() => import('@/features/products/pages/ProductList'))

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
                <Route path="/" element={
                    <ProtectedRoute>
                        <Insights />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <OrderList />
                    </ProtectedRoute>
                } />
                <Route path="/products" element={
                    <ProtectedRoute>
                        <ProductList />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UserList />
                    </ProtectedRoute>
                } />
                <Route path="/logout" element={
                    <ProtectedRoute>
                        <Logout />
                    </ProtectedRoute>
                } />
            </Routes>
        </Suspense>
    )
}
