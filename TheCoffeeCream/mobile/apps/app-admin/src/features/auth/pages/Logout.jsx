import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@thecoffeecream/ui-shared'

/**
 * Logout page for Admin app
 * Calls the logout function and redirects to login
 */
export default function Logout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        logout()
        const timer = setTimeout(() => navigate('/login'), 800)
        return () => clearTimeout(timer)
    }, [logout, navigate])

    return (
        <div className="admin-logout-page full-center">
            <p>Đang đăng xuất khỏi hệ thống quản trị...</p>
        </div>
    )
}
