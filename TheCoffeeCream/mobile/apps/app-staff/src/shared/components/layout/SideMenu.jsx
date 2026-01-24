import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMenu, useToast } from '../../contexts/UIContext'
import { useProducts } from '../../contexts/ProductContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'
import Icon from '../ui/Icon'
import '@/styles/components.scss'

const items = [
    { to: '/', icon: 'menu', label: 'Bảng bàn' },
    { to: '/orders?status=SUCCESS', icon: 'history', label: 'Lịch sử' },
    { to: '/report', icon: 'chart', label: 'Báo cáo' },
]

export default function SideMenu() {
    const { isOpen, close } = useMenu()
    const { syncProducts } = useProducts()
    const { showToast } = useToast()
    const { isDarkMode, toggleTheme } = useTheme()
    const { user } = useAuth()
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        if (syncing) return
        setSyncing(true)
        try {
            await syncProducts()
            showToast('Đã đồng bộ thực đơn mới!')
            close()
        } catch (error) {
            showToast('Lỗi: ' + error.message)
        } finally {
            setSyncing(false)
        }
    }

    return (
        <>
            {syncing && <LoadingSpinner fullScreen message="Đang đồng bộ..." />}
            <div className={`side-menu ${isOpen ? 'open' : ''}`} onClick={close}>
                <div className="side-drawer" onClick={e => e.stopPropagation()}>
                    <div className="side-header">
                        <div className="user-avatar">
                            {user?.username?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="user-info">
                            <div className="user">{user?.username || 'Staff'}</div>
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

                        <div className={`side-link ${syncing ? 'disabled' : ''}`} onClick={handleSync}>
                            <span className="side-link-icon"><Icon name="sync" size={20} /></span>
                            Đồng bộ dữ liệu
                        </div>

                        <div className="nav-divider"></div>

                        <Link to="/logout" className="side-link danger" onClick={close}>
                            <span className="side-link-icon"><Icon name="logout" size={20} /></span>
                            Đăng xuất
                        </Link>
                    </nav>

                    <div className="side-footer">
                        v2.0.0 (Premium)
                    </div>
                </div>
            </div>
        </>
    )
}
