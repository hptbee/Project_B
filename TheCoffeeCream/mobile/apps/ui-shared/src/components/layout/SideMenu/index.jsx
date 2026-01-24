import React from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../../contexts/UIContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { Icon } from '../../ui/Icon'
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

    return (
        <div className={`side-menu ${isOpen ? 'open' : ''}`} onClick={close}>
            <div className="side-drawer" onClick={e => e.stopPropagation()}>
                <div className="side-header">
                    <div className="side-logo-wrapper">
                        {logo ? <img src={logo} alt="Logo" className="side-logo" /> : <div className="side-logo-placeholder" />}
                    </div>
                    <div className="side-user-info">
                        <div className="user">{user?.username || 'User'}</div>
                        <div className="branch">The Coffee Cream</div>
                    </div>
                </div>

                <div className="theme-toggle-box">
                    <span className="label">Chế độ tối</span>
                    <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`} onClick={toggleTheme}>
                        <div className="knob">
                            {isDarkMode ? '🌙' : '☀️'}
                        </div>
                    </div>
                </div>

                <nav className="side-nav">
                    {items.map(it => (
                        <Link key={it.to} to={it.to} className="side-link" onClick={close}>
                            <span className="side-link-icon"><Icon name={it.icon} size={20} /></span>
                            {it.label}
                        </Link>
                    ))}

                    {onSync && (
                        <div className={`side-link ${isSyncing ? 'disabled' : ''}`} onClick={() => { onSync(); close(); }}>
                            <span className="side-link-icon"><Icon name="sync" size={20} /></span>
                            Đồng bộ dữ liệu
                        </div>
                    )}

                    <div className="nav-divider"></div>

                    <Link to="/logout" className="side-link danger" onClick={close}>
                        <span className="side-link-icon"><Icon name="logout" size={20} /></span>
                        Đăng xuất
                    </Link>
                </nav>

                <div className="side-footer">
                    {footer}
                </div>
            </div>
        </div>
    )
}
