import React, { useState } from 'react'
import { orderApi } from '@/shared/services/api/orders'
import { Icon, useToast, LoadingSpinner, useTranslation } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './OrderEditModal.scss'

export default function OrderEditModal({ order, onClose, onSave }) {
    const { t } = useTranslation()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        ...order,
        status: order.status,
        note: order.note
    })

    const handleDelete = async () => {
        if (window.confirm(t('modal.delete_order_confirm'))) {
            try {
                setLoading(true)
                await orderApi.deleteOrder(order.id)
                showToast(t('modal.delete_order_success'))
                onSave()
            } catch (error) {
                showToast(t('modal.delete_order_error'), 'error')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            // Prepare update request matching CreateOrderRequest DTO expected by backend UpdateOrderAsync
            const updateRequest = {
                clientOrderId: order.clientOrderId,
                orderType: order.orderType,
                tableNumber: order.tableNumber,
                paymentMethod: order.paymentMethod,
                cashAmount: order.cashAmount,
                transferAmount: order.transferAmount,
                discountType: order.discountType,
                discountValue: order.discountValue,
                status: formData.status,
                note: formData.note,
                items: order.items.map(i => ({
                    productId: i.productId,
                    name: i.name,
                    unitPrice: i.unitPrice,
                    quantity: i.quantity,
                    discountType: i.discountType,
                    discountValue: i.discountValue,
                    note: i.note
                }))
            }

            await orderApi.updateOrder(order.id, updateRequest)
            showToast(t('modal.update_success'))
            onSave()
        } catch (error) {
            showToast(t('modal.save_error'), 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container order-edit-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Đơn hàng #{order.id.split('-')[0]}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <Icon name="x" size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <section className="order-summary">
                            <div className="summary-row">
                                <span className="label">{t('form.customer_at')}:</span>
                                <span className="value">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">{t('form.total_amount')}:</span>
                                <span className="value price">{formatPrice(order.total, true)}</span>
                            </div>
                        </section>

                        <div className="form-group">
                            <label>{t('form.order_status')}</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="SUCCESS">{t('status.paid')}</option>
                                <option value="PENDING">{t('status.pending')}</option>
                                <option value="DRAFT">{t('status.draft')}</option>
                                <option value="REMOVED">{t('status.removed')}</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>{t('form.order_note')}</label>
                            <textarea
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                                placeholder={t('form.note_placeholder')}
                                rows={3}
                            />
                        </div>

                        <section className="order-items-preview">
                            <label>{t('form.item_list')} ({order.items.length})</label>
                            <div className="items-list">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="item-row">
                                        <div className="item-info">
                                            <span className="name">{item.name}</span>
                                            <span className="qty">x{item.quantity}</span>
                                        </div>
                                        <span className="item-total">{formatPrice(item.total, true)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-danger" onClick={handleDelete} disabled={loading}>{t('action.delete')}</button>
                        <div className="footer-right">
                            <button type="button" className="btn-secondary" onClick={onClose}>{t('action.cancel')}</button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? t('common.processing') : t('action.save')}
                            </button>
                        </div>
                    </div>
                </form>

                {loading && <LoadingSpinner fullScreen={true} />}
            </div>
        </div>
    )
}
