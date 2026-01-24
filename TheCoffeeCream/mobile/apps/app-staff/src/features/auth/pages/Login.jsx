import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/contexts/AuthContext'
import logo from '@/assets/icons/logo.png'
import './Login.scss'

/**
 * Login screen for staff members
 */
export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(credentials.username, credentials.password)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Sai tài khoản hoặc mật khẩu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page" data-theme="dark">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-logo-wrapper">
                            <img src={logo} alt="The Coffee Cream" className="brand-logo" />
                        </div>
                        <div className="brand-name">THE COFFEE CREAM</div>
                        <p>Hệ thống quản lý nội bộ</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder="Nhập username..."
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Nhập password..."
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <button
                            type="submit"
                            className={`login-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                'ĐĂNG NHẬP'
                            )}
                        </button>
                    </form>

                    <footer className="login-footer">
                        <p>Phát triển bởi <strong>The Coffee Cream Team</strong></p>
                        <p className="version">Phiên bản 2.0.0 (Staff App)</p>
                    </footer>
                </div>
            </div>

            <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    )
}
