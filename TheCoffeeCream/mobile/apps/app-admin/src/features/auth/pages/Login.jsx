import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, LoginPage, useTranslation } from '@thecoffeecream/ui-shared'
import logo from '@/assets/icons/logo.png'

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
            <div style={{ textAlign: 'center', marginTop: '15px', color: '#A0A0A0', fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/register" style={{ color: '#D4AF37', fontWeight: 'bold', textDecoration: 'none' }}>Register</Link>
            </div>
        </LoginPage>
    )
}
