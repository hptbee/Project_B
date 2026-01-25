import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@thecoffeecream/ui-shared'

export default function Logout() {
    const { logout } = useAuth()
    const nav = useNavigate()

    useEffect(() => {
        logout()
        const timer = setTimeout(() => nav('/login'), 800)
        return () => clearTimeout(timer)
    }, [logout, nav])

    return (
        <div className="page">
            <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p>Đang đăng xuất...</p>
            </div>
        </div>
    )
}
