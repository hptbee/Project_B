import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTableCart, useTableCartDispatch } from '@/shared/contexts/CartContext'
import { calculateCartTotal, formatPrice, useAutoSave, useTranslation } from '@thecoffeecream/ui-shared'
import { api } from '@/shared/services/api'
import { Fab, Icon, ConfirmModal, LoadingSpinner, IconChevron, Badge } from '@thecoffeecream/ui-shared'
import './TableOrder.scss'

export default function TableOrder() {
    const { t } = useTranslation()
    const { tableId } = useParams()
    const navigate = useNavigate()
    const tableCart = useTableCart(tableId)
    const dispatch = useTableCartDispatch(tableId)
    const [showNoteModal, setShowNoteModal] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [editingItemKey, setEditingItemKey] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState({ show: false, key: null })
    const [processing, setProcessing] = useState(false)

    // On first mount, if table is empty -> go to ProductList.
    // But when items later become empty (e.g. after deleting last item), do NOT redirect.
    const initialItemsCount = React.useRef(tableCart?.items?.length ?? 0)
    useEffect(() => {
        if (initialItemsCount.current === 0) {
            navigate(`/products?table=${tableId}`, { replace: true })
        }
    }, [tableId, navigate]) // tableId should be in deps, but it runs on mount check

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
        // Debounce Auto-save trigger
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
            await api.createOrder(payload)
            dispatch({ type: 'UPDATE_TABLE_STATUS', payload: { status: 'DRAFT' } })
            navigate('/')
        } catch (e) {
            console.error('Bg Save Draft failed', e)
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
                <button className="back icon-btn" onClick={() => navigate('/')} aria-label={t('cart.back')}>
                    <IconChevron variant="bold" />
                </button>
                <h2>{t('common.table_name', { name: tableId })}</h2>
            </header>

            <div className="order-metadata">
                <Badge variant="primary">
                    👤 {tableCart.customer || t('common.guest')}
                </Badge>
                <button onClick={openOrderNote} className="badge-note">
                    ✎ {tableCart.note || t('common.note')}
                </button>
            </div>

            <div className="list order-item-list">
                {(tableCart?.items || []).length === 0 ? (
                    <div className="empty-table-state">
                        <div className="empty-emoji">🍽️</div>
                        <div className="empty-text">{t('cart.empty_title')}</div>
                        <div className="empty-cta">
                            {t('cart.empty_instruction_prefix')} <span style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>+</span> {t('cart.empty_instruction_suffix')}
                        </div>
                    </div>
                ) : (
                    (tableCart?.items || []).map(item => (
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
                                    className="remove-btn icon-btn danger"
                                    aria-label={t('cart.delete_item')}
                                >
                                    <Icon name="trash" size={16} />
                                </button>
                                <div className="topping-qty-bar">
                                    <button className="icon-btn" onClick={() => handleQtyChange(item.key, -1)} aria-label="Giảm">
                                        <Icon name="minus" size={14} color="var(--text-primary)" />
                                    </button>
                                    <span className="qty-val">{item.qty}</span>
                                    <button className="icon-btn plus" style={{ background: 'var(--accent-amber)', color: '#fff' }} onClick={() => handleQtyChange(item.key, 1)} aria-label="Tăng">
                                        <Icon name="plus" size={14} color="#fff" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )))
                }
            </div>

            <Fab to={`/products?table=${tableId}`} />

            <div className="order-footer">
                <div className="total-row">
                    <div className="label">
                        {t('common.grand_total')} <span className="count-badge">{(tableCart.items || []).reduce((s, it) => s + (it.qty ?? it.quantity ?? 1), 0)}</span>
                    </div>
                    <div className="amount">
                        {formatPrice(total, true)}
                    </div>
                </div>
                <div className="footer-btns">
                    <button onClick={handleSaveDraft} className="btn-save-draft btn-secondary">{t('cart.save_draft')}</button>
                    <button onClick={handleCheckout} className="btn-checkout btn-primary">{t('action.checkout')}</button>
                </div>
            </div>

            {showNoteModal && (
                <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editingItemKey ? t('cart.item_note_title') : t('cart.order_note_title')}</span>
                            <button className="close-btn" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>✕</button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                autoFocus
                                placeholder={t('cart.enter_note_placeholder')}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel btn-secondary" onClick={() => { setShowNoteModal(false); setEditingItemKey(null); }}>{t('cart.back')}</button>
                            <button className="btn-confirm btn-primary" onClick={saveNote}>{t('common.agree')}</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                show={confirmDelete.show}
                title={t('cart.confirm_delete_item_title')}
                message={t('cart.confirm_delete_item_msg')}
                onConfirm={executeRemove}
                onCancel={() => setConfirmDelete({ show: false, key: null })}
                confirmText={t('cart.delete_item')}
                type="danger"
            />

            {processing && <LoadingSpinner fullScreen message={t('common.processing')} />}
        </div>
    )
}
