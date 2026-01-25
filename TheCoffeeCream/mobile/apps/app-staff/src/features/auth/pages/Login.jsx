import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, LoginPage, useTranslation } from '@thecoffeecream/ui-shared'
import logo from '@/assets/icons/logo.png'

/**
 * Login screen for staff members - Powered by ui-shared
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
            subtitle={t('common.subtitle')}
            version="2.0.0 (Staff App)"
            logo={logo}
            onLogin={handleLogin}
            loading={loading}
            error={error}
        />
    )
}
