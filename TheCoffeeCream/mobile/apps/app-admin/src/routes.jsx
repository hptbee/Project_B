import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@thecoffeecream/ui-shared'
import { Suspense, lazy } from 'react'

// Lazy load components
const Login = lazy(() => import('@/features/auth/pages/Login'))
const Logout = lazy(() => import('@/features/auth/pages/Logout'))
const Register = lazy(() => import('@/features/auth/pages/Register'))
const VerifyEmail = lazy(() => import('@/features/auth/pages/VerifyEmail'))
const Insights = lazy(() => import('@/features/dashboard/pages/Insights'))
const OrderList = lazy(() => import('@/features/orders/pages/OrderList'))
const UserList = lazy(() => import('@/features/users/pages/UserList'))
const ProductList = lazy(() => import('@/features/products/pages/ProductList'))
const ShopSettings = lazy(() => import('@/features/settings/pages/ShopSettings'))

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
    </div>
)

export default function AppRoutes() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
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
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <ShopSettings />
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
