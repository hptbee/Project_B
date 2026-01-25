import React, { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Icon, useAuth, ConfirmModal, useTranslation } from '@thecoffeecream/ui-shared'
import { useState } from 'react'
import './TopBar.scss'

export default function TopBar({ onMenuClick }) {
    const location = useLocation()
    const { user, logout } = useAuth()
    const { t } = useTranslation()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const breadcrumbs = useMemo(() => {
        const pathnames = location.pathname.split('/').filter((x) => x)
        return pathnames.map((value, index) => {
            const last = index === pathnames.length - 1
            const to = `/${pathnames.slice(0, index + 1).join('/')}`

            const labels = {
                'orders': t('nav.invoices'),
                'products': t('nav.menu'),
                'users': t('nav.hr'),
                'dashboard': t('nav.reports')
            }

            return {
                label: labels[value] || value,
                to,
                last
            }
        })
    }, [location])

    const pageTitle = useMemo(() => {
        if (location.pathname === '/') return t('nav.overview')
        const lastPart = location.pathname.split('/').filter(x => x).pop()
        const titles = {
            'orders': t('nav.invoices'),
            'products': t('nav.menu'),
            'users': t('nav.hr')
        }
        return titles[lastPart] || 'The Coffee Cream'
    }, [location, t])

    const handleLogout = () => {
        setShowLogoutConfirm(true)
    }

    const confirmLogout = () => {
        logout()
        setShowLogoutConfirm(false)
    }

    return (
        <header className="top-bar">
            <div className="top-bar-left">
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <Icon name="menu" />
                </button>
                <div className="page-title-section">
                    <nav className="breadcrumbs">
                        <Link to="/" className="breadcrumb-item">
                            <Icon name="home" size={14} />
                        </Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className="separator">/</span>
                                <Link
                                    to={crumb.to}
                                    className={`breadcrumb-item ${crumb.last ? 'active' : ''}`}
                                >
                                    {crumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="top-bar-right">
                <div className="user-profile" onClick={handleLogout}>
                    <div className="user-info">
                        <span className="username">{user?.username || 'Admin'}</span>
                        <span className="role">{user?.role === 'Admin' ? t('auth.role_admin') : user?.role || t('auth.role_admin')}</span>
                    </div>
                    <div className="avatar">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                </div>

                <ConfirmModal
                    show={showLogoutConfirm}
                    title={t('auth.logout')}
                    message={t('auth.logout_confirm')}
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                    confirmText={t('auth.logout')}
                    cancelText={t('action.cancel')}
                    type="danger"
                />
            </div>
        </header>
    )
}
