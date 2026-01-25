import { useState, useEffect } from 'react'
import { Icon, useToast, LoadingSpinner, useTranslation, productsApi as productApi, Select } from '@thecoffeecream/ui-shared'
import './ProductModal.scss'

export default function ProductModal({ product, onClose, onSave }) {
    const { t } = useTranslation()
    const isEdit = !!product
    const { showToast } = useToast()

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        code: '',
        price: 0,
        cost: 0,
        imageUrl: '',
        isActive: true,
        isTopping: false,
        toppingIds: []
    })

    const [categories, setCategories] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    productApi.getCategories(),
                    productApi.getProducts()
                ])
                setCategories(cats)
                setAllProducts(prods)

                if (product) {
                    setFormData({
                        name: product.name,
                        category: product.category,
                        code: product.code,
                        price: product.price,
                        cost: product.cost,
                        imageUrl: product.imageUrl,
                        isActive: product.isActive,
                        isTopping: product.isTopping,
                        toppingIds: product.toppings ? product.toppings.map(t => t.id) : []
                    })
                } else if (cats.length > 0) {
                    setFormData(prev => ({ ...prev, category: cats[0].name }))
                }
            } catch (error) {
                showToast('Lỗi tải dữ liệu khởi tạo', 'error')
            } finally {
                setInitLoading(false)
            }
        }
        fetchData()
    }, [product])

    const availableToppings = allProducts.filter(p => p.isTopping && p.id !== product?.id)

    const handleToppingToggle = (id) => {
        setFormData(prev => {
            const current = prev.toppingIds
            if (current.includes(id)) {
                return { ...prev, toppingIds: current.filter(tid => tid !== id) }
            } else {
                return { ...prev, toppingIds: [...current, id] }
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.category) {
            showToast(t('common.required_error'), 'warning')
            return
        }

        try {
            setLoading(true)
            if (isEdit) {
                await productApi.updateProduct(product.id, formData)
                showToast(t('modal.update_success'))
            } else {
                await productApi.createProduct(formData)
                showToast(t('modal.add_success'))
            }
            onSave()
        } catch (error) {
            console.error('Failed to save product:', error)
            showToast('Lỗi khi lưu sản phẩm', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (initLoading) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container product-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? t('modal.edit_product') : t('modal.create_product')}</h2>
                    <button className="close-btn" onClick={onClose} title={t('action.cancel')}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-main-grid">
                            <div className="form-left">
                                <div className="form-group">
                                    <label>{t('form.product_name')}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ví dụ: Cà phê sữa đá"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('form.product_code')}</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            placeholder="CODE"
                                        />
                                    </div>
                                    <Select
                                        label={t('form.category')}
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        options={categories.map(c => ({ value: c.name, label: c.name }))}
                                        placeholder={false}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>{t('form.price')}</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('form.cost')}</label>
                                        <input
                                            type="number"
                                            value={formData.cost}
                                            onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>{t('form.image_url')}</label>
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="form-toggles">
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <span>{t('form.is_active')}</span>
                                    </label>
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.isTopping}
                                            onChange={e => setFormData({ ...formData, isTopping: e.target.checked })}
                                        />
                                        <span>{t('form.is_topping')}</span>
                                    </label>
                                </div>
                            </div>

                            {!formData.isTopping && (
                                <div className="form-right">
                                    <label className="section-label">{t('form.toppings_list')}</label>
                                    <div className="toppings-selection-list">
                                        {availableToppings.map(t => (
                                            <div
                                                key={t.id}
                                                className={`topping-select-item ${formData.toppingIds.includes(t.id) ? 'selected' : ''}`}
                                                onClick={() => handleToppingToggle(t.id)}
                                            >
                                                <div className="check-box">
                                                    {formData.toppingIds.includes(t.id) && <Icon name="check" size={12} />}
                                                </div>
                                                <span className="name">{t.name}</span>
                                                <span className="price">+{t.price / 1000}k</span>
                                            </div>
                                        ))}
                                        {availableToppings.length === 0 && (
                                            <div className="empty-toppings">{t('form.empty_toppings')}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>{t('action.cancel')}</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? t('common.processing') : (isEdit ? t('action.update') : t('action.add_new'))}
                        </button>
                    </div>
                </form>

                {loading && <LoadingSpinner fullScreen={true} />}
            </div>
        </div>
    )
}
