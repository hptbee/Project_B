import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../contexts/UIContext'
import { useProducts } from '../../contexts/ProductContext'
import { useToast } from '../../contexts/UIContext'
import LoadingSpinner from '../ui/LoadingSpinner'
import Icon from '../ui/Icon'
import '@/styles/components.scss'

const items = [
    { to: '/', icon: 'menu', label: 'Phòng bàn' },
    { to: '/orders?status=SUCCESS', icon: 'history', label: 'Lịch sử đơn hàng' },
    { to: '/report', icon: 'chart', label: 'Báo cáo cuối ngày' },
    { to: '/logout', icon: 'logout', label: 'Đăng xuất', className: 'danger' }
]

export default function SideMenu() {
    const { isOpen, close } = useMenu()
    const { syncProducts } = useProducts()
    const { showToast } = useToast()
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        if (syncing) return

        setSyncing(true)
        try {
            await syncProducts()
            showToast('Đồng bộ dữ liệu thành công!')
            close()
        } catch (error) {
            console.error('Sync error:', error)
            showToast('Đồng bộ thất bại: ' + error.message)
        } finally {
            setSyncing(false)
        }
    }

    return (
        <>
            {syncing && <LoadingSpinner fullScreen message="Đang đồng bộ dữ liệu..." />}
            <div className={`side-menu ${isOpen ? 'open' : ''}`} onClick={close}>
                <div className="side-drawer" onClick={e => e.stopPropagation()}>
                    <div className="side-header">
                        <div className="user">Thu Ngân Hoàng</div>
                        <div className="branch">Chi nhánh trung tâm</div>
                    </div>
                    <nav>
                        {items.map(it => (
                            <Link key={it.to} to={it.to} className={`side-link ${it.className || ''}`} onClick={close}>
                                <span className="side-link-icon"><Icon name={it.icon} size={18} /></span>
                                {it.label}
                            </Link>
                        ))}
                        <div
                            className={`side-link ${syncing ? 'disabled' : ''}`}
                            onClick={handleSync}
                            style={{ cursor: syncing ? 'not-allowed' : 'pointer' }}
                        >
                            <span className="side-link-icon">
                                <Icon name="sync" size={18} />
                            </span>
                            {syncing ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
