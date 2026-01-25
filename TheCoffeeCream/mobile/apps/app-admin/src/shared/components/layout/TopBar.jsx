import React, { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Icon, useAuth, useTranslation } from '@thecoffeecream/ui-shared'
import './TopBar.scss'

export default function TopBar({ onMenuClick }) {
    const location = useLocation()
    const { user } = useAuth()
    const { t } = useTranslation()

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
                <div className="user-profile">
                    <div className="user-info">
                        <span className="username">{user?.username || 'Admin'}</span>
                        <span className="role">{user?.role === 'Admin' ? t('auth.role_admin') : user?.role || t('auth.role_admin')}</span>
                    </div>
                    <div className="avatar">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                </div>
            </div>
        </header>
    )
}
