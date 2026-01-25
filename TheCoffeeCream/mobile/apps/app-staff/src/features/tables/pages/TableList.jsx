import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/shared/contexts/CartContext'
import { useMenu, Badge, Icon, useTranslation, PageHeaderSkeleton, GridSkeleton } from '@thecoffeecream/ui-shared'
import { calculateCartTotal } from '@thecoffeecream/ui-shared'
import { formatPrice, formatTime } from '@thecoffeecream/ui-shared'
import './TableList.scss'

export default function TableList() {
    const { t } = useTranslation()
    const cart = useCart()
    const menu = useMenu()
    const [tab, setTab] = useState('all') // 'all', 'active', 'empty'

    // Combine and enrich with cart data
    const takeawayTable = { id: 'takeaway', name: t('pos.takeaway'), type: 'takeaway' }
    const floorTables = Array.from({ length: 12 }).map((_, i) => ({
        id: (i + 1).toString(),
        name: `Bàn ${i + 1}`,
        type: 'table'
    }))

    const allItems = [takeawayTable, ...floorTables].map(t => {
        const tableCart = cart?.tables?.[t.id] || { items: [] }
        const itemsCount = (tableCart.items || []).reduce((sum, it) => sum + (it.qty ?? it.quantity ?? 1), 0)

        return {
            ...t,
            amount: calculateCartTotal(tableCart.items),
            active: tableCart.items.length > 0,
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

    if (!cart) {
        return (
            <div className="page">
                <PageHeaderSkeleton hasAction={false} />
                <div className="home-tabs">
                    <div className="skeleton-tab" style={{ background: 'var(--bg-glass)', width: '80px', height: '36px', borderRadius: '18px' }} />
                    <div className="skeleton-tab" style={{ background: 'var(--bg-glass)', width: '80px', height: '36px', borderRadius: '18px' }} />
                    <div className="skeleton-tab" style={{ background: 'var(--bg-glass)', width: '80px', height: '36px', borderRadius: '18px' }} />
                </div>
                <GridSkeleton count={12} className="skeleton-grid" />
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
