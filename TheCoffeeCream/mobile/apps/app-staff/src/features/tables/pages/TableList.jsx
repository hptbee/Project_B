import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/shared/contexts/CartContext'
import { useMenu, Badge, Icon, Skeleton, useTranslation } from '@thecoffeecream/ui-shared'
import { calculateCartTotal } from '@thecoffeecream/ui-shared'
import { formatPrice, formatTime } from '@thecoffeecream/ui-shared'
import './TableList.scss'

export default function TableList() {
    const { t } = useTranslation()
    const cart = useCart()
    const menu = useMenu()
    const [_now, setNow] = useState(Date.now())
    const [tab, setTab] = useState('all') // 'all', 'active', 'empty'

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000)
        return () => clearInterval(interval)
    }, [])

    // Takeaway "table"
    const takeaway = { id: 'takeaway', name: t('pos.takeaway'), type: 'takeaway' }

    // Generate table data
    const rawTables = Array.from({ length: 12 }).map((_, i) => {
        const id = i + 1
        return {
            id: id.toString(),
            name: `Bàn ${id}`,
            type: 'table'
        }
    })

    // Combine and enrich with cart data
    const allItems = [takeaway, ...rawTables].map(t => {
        const tableCart = cart.tables[t.id] || { items: [] }
        const amount = calculateCartTotal(tableCart.items)
        const active = tableCart.items.length > 0
        const itemsCount = (tableCart.items || []).reduce((sum, it) => sum + (it.qty ?? it.quantity ?? 1), 0)
        return {
            ...t,
            amount,
            active,
            createdAt: tableCart.createdAt,
            itemsCount,
            status: tableCart.status || 'DRAFT'
        }
    })

    const filtered = allItems.filter(t => {
        if (tab === 'all') return true
        if (tab === 'active') return t.active
        if (tab === 'empty') return !t.active
        return true
    })

    // Loading Skeleton
    if (!cart) {
        return (
            <div className="page">
                <header className="page-header">
                    <Skeleton width="40px" height="40px" variant="rect" />
                    <Skeleton width="150px" height="24px" />
                </header>
                <div className="home-tabs">
                    <Skeleton width="80px" height="36px" variant="circle" className="skeleton-tab" />
                    <Skeleton width="80px" height="36px" variant="circle" className="skeleton-tab" />
                    <Skeleton width="80px" height="36px" variant="circle" className="skeleton-tab" />
                </div>
                <div className="grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div className="glass-card skeleton-card" key={i}>
                            <Skeleton width="60%" height="20px" className="skeleton-title" />
                            <Skeleton width="40%" height="16px" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <header className="page-header">
                <button className="menu icon-btn" onClick={() => menu.toggle()} aria-label="Menu">
                    <Icon name="menu" size={24} color="var(--text-primary)" />
                </button>
                <h2>{t('nav.floorplan')}</h2>
            </header>

            <div className="home-tabs">
                <button className={`home-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>{t('common.all')}</button>
                <button className={`home-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>{t('status.occupied')}</button>
                <button className={`home-tab ${tab === 'empty' ? 'active' : ''}`} onClick={() => setTab('empty')}>{t('status.empty')}</button>
            </div>

            <div className="grid">
                {filtered.map(table => (
                    <Link to={table.active ? `/table/${table.id}` : `/products?table=${table.id}`} className={`card ${table.active ? 'active' : ''}`} key={table.id}>
                        <div className="card-title">
                            {table.type === 'takeaway' && <span className="takeaway-icon">🛍️</span>}
                            {table.type === 'takeaway' ? table.name : t('common.table_name', { name: table.id })}
                            {table.active && <Badge variant="info" size="sm">{t('common.item_count', { count: table.itemsCount })}</Badge>}
                        </div>
                        {table.active && (
                            <div className="card-info">
                                <div className="card-time">
                                    {formatTime(table.createdAt)}
                                </div>
                                <div className="card-amount">
                                    {formatPrice(table.amount, true)}
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
