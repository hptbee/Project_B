import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/shared/contexts/CartContext'
import { useMenu } from '@/shared/contexts/UIContext'
import { calculateCartTotal } from '@/shared/utils/calculations'
import { formatPrice, formatTime } from '@/shared/utils/formatters'
import Badge from '@/shared/components/ui/Badge'
import Icon from '@/shared/components/ui/Icon'
import './TableList.scss'

export default function TableList() {
    const cart = useCart()
    const menu = useMenu()
    const [now, setNow] = useState(Date.now())
    const [tab, setTab] = useState('all') // 'all', 'active', 'empty'

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 60000)
        return () => clearInterval(interval)
    }, [])

    // Takeaway "table"
    const takeaway = { id: 'takeaway', name: 'Mang về', type: 'takeaway' }

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
        return {
            ...t,
            amount,
            active,
            createdAt: tableCart.createdAt,
            itemsCount: tableCart.items.length,
            status: tableCart.status || 'DRAFT'
        }
    })

    const filtered = allItems.filter(t => {
        if (tab === 'all') return true
        if (tab === 'active') return t.active
        if (tab === 'empty') return !t.active
        return true
    })

    return (
        <div className="page">
            <header className="page-header">
                <button className="menu" onClick={() => menu.toggle()} aria-label="Menu">
                    <Icon name="menu" size={24} color="var(--text-primary)" />
                </button>
                <h2>Thế giới cà phê</h2>
            </header>

            <div className="home-tabs">
                <button className={`home-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>Tất cả</button>
                <button className={`home-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>Sử dụng</button>
                <button className={`home-tab ${tab === 'empty' ? 'active' : ''}`} onClick={() => setTab('empty')}>Còn trống</button>
            </div>

            <div className="grid">
                {filtered.map(t => (
                    <Link to={t.active ? `/table/${t.id}` : `/products?table=${t.id}`} className={`card ${t.active ? 'active' : ''}`} key={t.id}>
                        <div className="card-title">
                            {t.type === 'takeaway' && <span className="takeaway-icon">🛍️</span>}
                            {t.name}
                            {t.active && t.status === 'DRAFT' && (
                                <Badge variant="danger" size="sm" pill={false}>DRAFT</Badge>
                            )}
                        </div>
                        {t.active && (
                            <div className="card-info">
                                <div className="card-time">
                                    {formatTime(t.createdAt)}
                                </div>
                                <div className="card-amount">
                                    {formatPrice(t.amount, true)}
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
