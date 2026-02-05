import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useTranslation } from '@thecoffeecream/ui-shared'

export default function Logout() {
    const { logout } = useAuth()
    const { t } = useTranslation()
    const nav = useNavigate()

    useEffect(() => {
        logout()
        const timer = setTimeout(() => nav('/login'), 800)
        return () => clearTimeout(timer)
    }, [logout, nav])

    return (
        <div className="page">
            <div className="page-content content-center">
                <p>{t('nav.logout_processing')}</p>
            </div>
        </div>
    )
}
