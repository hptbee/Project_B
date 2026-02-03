import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, LoginPage, useTranslation } from '@thecoffeecream/ui-shared'
import AuthToggles from '../components/AuthToggles'
import logo from '@/assets/icons/logo.png'
import './Login.scss'

/**
 * Login screen for Admin - Powered by ui-shared
 */
export default function Login() {
    const { t } = useTranslation()
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (username, password) => {
        setError('')
        setLoading(true)

        try {
            await login(username, password)
            navigate('/')
        } catch (err) {
            setError(err.message || t('auth.invalid_creds'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <LoginPage
            title="THE COFFEE CREAM"
            subtitle={t('app.admin_subtitle')}
            version="1.0.0 (Admin App)"
            logo={logo}
            onLogin={handleLogin}
            loading={loading}
            error={error}
        >
            <div className="login-footer-link">
                {t('auth.have_account').replace('?', '')}? <Link to="/register">{t('register.register_btn')}</Link>
            </div>

            <AuthToggles />
        </LoginPage>
    )
}
