import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, LoginPage, useTranslation, useTheme, Icon } from '@thecoffeecream/ui-shared'
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

            <div className="auth-toggles">
                <ThemeToggle />
                <LanguageToggle />
            </div>
        </LoginPage>
    )
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    // Safety check in case theme context is missing or loading
    if (!toggleTheme) return null;

    return (
        <button
            onClick={toggleTheme}
            className="toggle-btn"
        >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
    )
}

function LanguageToggle() {
    const { locale, setLocale } = useTranslation()

    const toggleLanguage = () => {
        setLocale(locale === 'vi' ? 'en' : 'vi')
    }

    return (
        <button
            onClick={toggleLanguage}
            className="toggle-btn"
        >
            <span className="lang-badge">{locale === 'vi' ? 'EN' : 'VN'}</span>
            {locale === 'vi' ? 'English' : 'Tiếng Việt'}
        </button>
    )
}
