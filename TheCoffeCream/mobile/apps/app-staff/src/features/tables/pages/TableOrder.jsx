import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTableCart, useTableCartDispatch } from '@/shared/contexts/CartContext'
import useAutoSave from '@/shared/hooks/useAutoSave'
import Fab from '@/shared/components/ui/Fab'
import Icon from '@/shared/components/ui/Icon'
import ConfirmModal from '@/shared/components/ui/ConfirmModal'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import './TableOrder.scss'
import IconChevron from '@/shared/components/ui/IconChevron'

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

    const total = tableCart.items.reduce(
        (s, i) => s + i.product.price * i.qty + (i.toppings || []).reduce((t, tt) => t + tt.price, 0) * i.qty,
        0
    )

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
        try {
            const orderItems = tableCart.items.map(item => ({
                ProductId: item.product.id,
                Name: item.product.title,
                UnitPrice: item.product.price,
                Quantity: item.qty,
                SelectedToppingNames: (item.toppings || []).map(t => t.title),
                Note: item.note
            }))

            if (orderItems.length === 0) return

            const payload = {
                ClientOrderId: tableCart.clientOrderId || crypto.randomUUID(),
                OrderType: 'DINE_IN',
                TableNumber: !isNaN(parseInt(tableId)) ? parseInt(tableId) : 0,
                PaymentMethod: 'CASH',
                CashAmount: 0,
                TransferAmount: 0,
                Items: orderItems,
                Status: 'DRAFT',
                Note: tableCart.note || ''
            }

            const { api } = await import('@/shared/services/api')
            console.log('Auto-saved draft for table', tableId)
        } catch (e) {
            console.error('Auto-save failed:', e)
        }
    }

    // Auto-save on changes
    useAutoSave((_data) => {
        // We can just call handleAutoSave, but we need to ensure it uses latest state.
        // handleAutoSave reads from tableCart.items and tableCart.note which are from context/props.
        // Since they are dependencies of useAutoSave (via data arg), it should work if we pass them.
        if (tableCart.items.length > 0) {
            handleAutoSave()
        }
    }, [tableCart.items, tableCart.note], 3000)

    const handleCheckout = () => {
        navigate(`/checkout/${tableId}`)
    }

    const handleSaveDraft = async () => {
        setProcessing(true)
        try {
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

            const { api } = await import('@/shared/services/api')
            await api.createOrder(payload)
            navigate('/')
            dispatch({ type: 'UPDATE_TABLE_STATUS', payload: { status: 'DRAFT' } })
        } catch (e) {
            console.error(e)
            alert('Lưu nháp thất bại: ' + e.message)
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
                <h2>{tableCart.orderId || 'N/A'}: Bàn {tableId}</h2>
            </header>

            <div className="order-metadata">
                <span className="badge-customer">
                    👤 {tableCart.customer || 'Khách lẻ'}
                </span>
                <span onClick={openOrderNote} className="badge-note">
                    ✎ {tableCart.note || 'Ghi chú'}
                </span>
                <span className={`badge-status ${tableCart.status === 'SUCCESS' ? 'success' : 'draft'}`}>
                    {tableCart.status || 'DRAFT'}
                </span>
            </div>

            <div className="list order-item-list">
                {tableCart.items.map(item => (
                    <div key={item.key} className="order-item">
                        <div className="thumb-small thumb-container">
                            {/* Product image placeholder */}
                        </div>
                        <div className="item-content">
                            <div className="item-title">{item.product.title}</div>
                            {item.toppings && item.toppings.length > 0 && (
                                <div className="item-toppings">
                                    {item.toppings.map(t => `+1 ${t.title}`).join(', ')}
                                </div>
                            )}
                            <div
                                onClick={() => openItemNote(item)}
                                className={`item-note-trigger ${item.note ? 'has-note' : 'no-note'}`}
                            >
                                {item.note ? `✎ ${item.note}` : '+ Thêm ghi chú món'}
                            </div>
                            <div className="item-price">
                                {item.product.price.toLocaleString()}
                            </div>
                        </div>
                        <div className="item-actions">
                            <button
                                onClick={() => handleRemove(item.key)}
                                className="remove-btn"
                            >
                                <Icon name="trash" size={16} color="#c62828" />
                            </button>
                            <div className="qty-control">
                                <button
                                    onClick={() => handleQtyChange(item.key, -1)}
                                >
                                    −
                                </button>
                                <span>
                                    {item.qty}
                                </span>
                                <button
                                    onClick={() => handleQtyChange(item.key, 1)}
                                >
                                    +
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
                        Tổng tiền <span className="count-badge">{tableCart.items.length}</span>
                    </div>
                    <div className="amount">
                        {total.toLocaleString()}
                    </div>
                </div>
                <div className="footer-btns">
                    <button
                        onClick={handleSaveDraft}
                        className="btn-save-draft"
                    >
                        Lưu nháp
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="btn-checkout"
                    >
                        Thanh toán
                    </button>
                </div>
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editingItemKey ? 'Ghi chú món' : 'Ghi chú đơn hàng'}</span>
                            <span className="close-btn" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>✕</span>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                autoFocus
                                placeholder="Nhập ghi chú đơn hàng..."
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>Quay lại</button>
                            <button className="btn-confirm" onClick={saveNote}>Xong</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Remove Confirmation */}
            <ConfirmModal
                show={confirmDelete.show}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa món này khỏi đơn hàng?"
                onConfirm={executeRemove}
                onCancel={() => setConfirmDelete({ show: false, key: null })}
                confirmText="Xóa món"
                type="danger"
            />

            {processing && <LoadingSpinner fullScreen message="Đang lưu nháp..." />}
        </div>
    )
}
