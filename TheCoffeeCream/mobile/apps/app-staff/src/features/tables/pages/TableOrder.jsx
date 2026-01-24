import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTableCart, useTableCartDispatch } from '@/shared/contexts/CartContext'
import useAutoSave from '@/shared/hooks/useAutoSave'
import { calculateCartTotal } from '@/shared/utils/calculations'
import { formatPrice } from '@/shared/utils/formatters'
import { api } from '@/shared/services/api'
import { Fab, Icon, ConfirmModal, LoadingSpinner, IconChevron, Badge } from '@thecoffeecream/ui-shared'
import './TableOrder.scss'

export default function TableOrder() {
    const { tableId } = useParams()
    const navigate = useNavigate()
    const tableCart = useTableCart(tableId)
    const dispatch = useTableCartDispatch(tableId)
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [editingItemKey, setEditingItemKey] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState({ show: false, key: null })
    const [processing, setProcessing] = useState(false)

    // Redirect to ProductList if table is empty
    useEffect(() => {
        if (tableCart.items.length === 0) {
            navigate(`/products?table=${tableId}`)
        }
    }, [tableCart.items.length, tableId, navigate])

    const total = calculateCartTotal(tableCart.items)

    const handleQtyChange = (key, delta) => {
        const item = tableCart.items.find(i => i.key === key)
        if (!item) return
        const newQty = Math.max(1, item.qty + delta)
        dispatch({ type: 'UPDATE_QTY_TABLE', payload: { key, qty: newQty } })
        setTimeout(handleAutoSave, 0)
    }

    const handleRemove = (key) => {
        setConfirmDelete({ show: true, key })
    }

    const executeRemove = () => {
        const { key } = confirmDelete
        dispatch({ type: 'REMOVE_FROM_TABLE', payload: { key } })
        setConfirmDelete({ show: false, key: null })
        setTimeout(handleAutoSave, 0)
    }

    const handleAutoSave = async () => {
        console.log('Draft updated locally for table', tableId)
    }

    // Auto-save on changes
    useAutoSave((_data) => {
        if (tableCart.items.length > 0) {
            handleAutoSave()
        }
    }, [tableCart.items, tableCart.note], 3000)

    const handleCheckout = () => {
        navigate(`/checkout/${tableId}`)
    }

    const handleSaveDraft = async () => {
        setProcessing(true)
        const orderItems = tableCart.items.map(item => ({
            ProductId: item.product.id,
            Name: item.product.title,
            UnitPrice: item.product.price,
            Quantity: item.qty,
            SelectedToppingNames: (item.toppings || []).map(t => t.title),
            Note: item.note
        }))

        const payload = {
            ClientOrderId: tableCart.clientOrderId || crypto.randomUUID(),
            OrderType: 'DINE_IN',
            TableNumber: !isNaN(parseInt(tableId)) ? parseInt(tableId) : 0,
            PaymentMethod: 'CASH',
            CashAmount: total,
            TransferAmount: 0,
            Items: orderItems,
            Status: 'DRAFT',
            Note: tableCart.note || ''
        }

        try {
            navigate('/')
            dispatch({ type: 'UPDATE_TABLE_STATUS', payload: { status: 'DRAFT' } })
            await api.createOrder(payload)
        } catch (e) {
            console.error('Bg Save Draft failed', e)
        } finally {
            setProcessing(false)
        }
    }

    const saveNote = () => {
        if (editingItemKey) {
            dispatch({ type: 'UPDATE_ITEM_NOTE', payload: { key: editingItemKey, note: noteText } })
        } else {
            dispatch({ type: 'UPDATE_TABLE_NOTE', payload: { note: noteText } })
        }
        setShowNoteModal(false)
        setEditingItemKey(null)
        setTimeout(handleAutoSave, 0)
    }

    const openOrderNote = () => {
        setEditingItemKey(null)
        setNoteText(tableCart.note || '')
        setShowNoteModal(true)
    }

    const openItemNote = (item) => {
        setEditingItemKey(item.key)
        setNoteText(item.note || '')
        setShowNoteModal(true)
    }

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate('/')} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>BÀN: {tableId}</h2>
            </header>

            <div className="order-metadata">
                <Badge variant="primary">
                    👤 {tableCart.customer || 'Khách lẻ'}
                </Badge>
                <button onClick={openOrderNote} className="badge-note">
                    ✎ {tableCart.note || 'Ghi chú'}
                </button>
            </div>

            <div className="list order-item-list">
                {tableCart.items.map(item => (
                    <div key={item.key} className="order-item">
                        <div
                            className="item-content clickable"
                            onClick={() => navigate(`/products/${item.product.id}?table=${tableId}&itemKey=${encodeURIComponent(item.key)}`)}
                        >
                            <div className="item-title">{item.product.title}</div>
                            {item.toppings && item.toppings.length > 0 && (
                                <div className="item-toppings">
                                    {item.toppings.map(t => `+1 ${t.title}`).join(', ')}
                                </div>
                            )}
                            {item.note && (
                                <span className="item-note-trigger has-note">
                                    ✎ {item.note}
                                </span>
                            )}
                            <div className="item-price">
                                {formatPrice(item.product.price, true)}
                            </div>
                        </div>
                        <div className="item-actions">
                            <button
                                onClick={() => handleRemove(item.key)}
                                className="remove-btn"
                                aria-label="Xóa món"
                            >
                                <Icon name="trash" size={16} />
                            </button>
                            <div className="table-qty-bar">
                                <button className="qty-btn" onClick={() => handleQtyChange(item.key, -1)} aria-label="Giảm">
                                    <Icon name="minus" size={14} color="var(--text-secondary)" />
                                </button>
                                <span className="qty-val">{item.qty}</span>
                                <button className="qty-btn plus" onClick={() => handleQtyChange(item.key, 1)} aria-label="Tăng">
                                    <Icon name="plus" size={14} color="#fff" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Fab to={`/products?table=${tableId}`} />

            <div className="order-footer">
                <div className="total-row">
                    <div className="label">
                        Tổng tiền <span className="count-badge">{(tableCart.items || []).reduce((s, it) => s + (it.qty ?? it.quantity ?? 1), 0)}</span>
                    </div>
                    <div className="amount">
                        {formatPrice(total, true)}
                    </div>
                </div>
                <div className="footer-btns">
                    <button onClick={handleSaveDraft} className="btn-save-draft">Lưu nháp</button>
                    <button onClick={handleCheckout} className="btn-checkout">Thanh toán</button>
                </div>
            </div>

            {showNoteModal && (
                <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editingItemKey ? 'Ghi chú món' : 'Ghi chú đơn hàng'}</span>
                            <button className="close-btn" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>✕</button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                autoFocus
                                placeholder="Nhập ghi chú..."
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>Quay lại</button>
                            <button className="btn-confirm" onClick={saveNote}>Xong</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                show={confirmDelete.show}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa món này?"
                onConfirm={executeRemove}
                onCancel={() => setConfirmDelete({ show: false, key: null })}
                confirmText="Xóa món"
                type="danger"
            />

            {processing && <LoadingSpinner fullScreen message="Đang xử lý..." />}
        </div>
    )
}
