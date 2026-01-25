import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@thecoffeecream/ui-shared'
import Login from '@/features/auth/pages/Login'
import Logout from '@/features/auth/pages/Logout'
import Insights from '@/features/dashboard/pages/Insights'

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

import OrderList from '@/features/orders/pages/OrderList'
import UserList from '@/features/users/pages/UserList'
import ProductList from '@/features/products/pages/ProductList'

export default function AppRoutes() {
    return (
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
    )
}
