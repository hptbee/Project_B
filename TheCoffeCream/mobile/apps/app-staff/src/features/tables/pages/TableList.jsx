import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/shared/contexts/CartContext'
import { useMenu } from '@/shared/contexts/UIContext'
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

    const formatTime = (start) => {
        if (!start) return '0p'
        const diff = now - start
        if (diff < 0) return '0p'
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours === 0) return `${mins}p`
        return `${hours}g ${mins}p`
    }

    // Generate table data
    const rawTables = Array.from({ length: 12 }).map((_, i) => {
        const id = i + 1
        return {
            id: id.toString(),
            name: `Bàn ${id}`,
            type: 'table'
        }
    })

    // Takeaway "table"
    const takeaway = { id: 'takeaway', name: 'Mang về', type: 'takeaway' }

    // Combine and enrich with cart data
    const allItems = [takeaway, ...rawTables].map(t => {
        const tableCart = cart.tables[t.id] || { items: [] }
        const amount = tableCart.items.reduce(
            (sum, item) => sum + item.product.price * item.qty + (item.toppings || []).reduce((t, tt) => t + tt.price, 0) * item.qty,
            0
        )
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
                <button className="menu" onClick={() => menu.toggle()}>☰</button>
                <h2>Bảng bàn</h2>
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
                                <span className="badge-draft">Draft</span>
                            )}
                        </div>
                        {t.active && (
                            <div className="card-info">
                                <div className="card-time">
                                    {formatTime(t.createdAt)}
                                </div>
                                <div className="card-amount">
                                    {t.amount.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
