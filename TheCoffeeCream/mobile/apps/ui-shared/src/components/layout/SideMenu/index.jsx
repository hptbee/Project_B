import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useMenu } from '../../../contexts/UIContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useTranslation } from '../../../contexts/LanguageContext'
import { Icon } from '../../ui/Icon'
import { ConfirmModal } from '../../ui/ConfirmModal'
import './SideMenu.scss'

export function SideMenu({
    items = [],
    logo,
    footer = 'v1.0.0',
    onSync,
    isSyncing = false
}) {
    const { isOpen, close } = useMenu()
    const { isDarkMode, toggleTheme } = useTheme()
    const { user } = useAuth()
    const { locale, setLocale, t } = useTranslation()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        setShowLogoutConfirm(false)
        navigate('/logout')
    }

    return (
        <>
            <div className={`side-menu ${isOpen ? 'open' : ''}`} onClick={close}>
                <div className="side-drawer" onClick={e => e.stopPropagation()}>
                    <div className="side-header">
                        <div className="side-logo-wrapper">
                            {logo ? <img src={logo} alt="Logo" className="side-logo" /> : <div className="side-logo-placeholder" />}
                        </div>
                        <div className="side-user-info">
                            <div className="user">{user?.username || t('auth.username')}</div>
                            <div className="branch">The Coffee Cream</div>
                        </div>
                    </div>

                    <nav className="side-nav">
                        {items.map(it => (
                            <NavLink key={it.to} to={it.to} className="side-link" onClick={close}>
                                <span className="side-link-icon"><Icon name={it.icon} size={20} /></span>
                                {it.label}
                            </NavLink>
                        ))}

                        {onSync && (
                            <div className={`side-link ${isSyncing ? 'disabled' : ''}`} onClick={() => { onSync(); close(); }}>
                                <span className="side-link-icon"><Icon name="sync" size={20} /></span>
                                {t('action.sync')}
                            </div>
                        )}

                        <div className="nav-divider"></div>

                        <div className="side-link danger" onClick={() => { close(); setShowLogoutConfirm(true); }}>
                            <span className="side-link-icon"><Icon name="logout" size={20} /></span>
                            {t('auth.logout')}
                        </div>
                    </nav>

                    <div className="side-controls">
                        <div className="control-box">
                            <span className="label">{t('nav.language')}</span>
                            <div className="lang-switcher">
                                <button
                                    className={`lang-btn ${locale === 'vi' ? 'active' : ''}`}
                                    onClick={() => setLocale('vi')}
                                >
                                    🇻🇳
                                </button>
                                <button
                                    className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
                                    onClick={() => setLocale('en')}
                                >
                                    🇺🇸
                                </button>
                            </div>
                        </div>

                        <div className="control-box">
                            <span className="label">{t('common.dark_mode')}</span>
                            <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`} onClick={toggleTheme}>
                                <div className="knob">
                                    {isDarkMode ? '🌙' : '☀️'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-footer">
                        {footer}
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showLogoutConfirm}
                title={t('app.exit_title')}
                message={t('auth.logout_confirm')}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
                confirmText={t('auth.logout')}
                type="danger"
            />
        </>
    )
}
