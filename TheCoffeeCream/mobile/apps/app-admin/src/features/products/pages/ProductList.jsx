import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner, Badge, Icon, useToast, ConfirmModal, SearchBar, Pagination, useTranslation, productsApi as productApi, Select } from '@thecoffeecream/ui-shared'
import ProductModal from '../components/ProductModal'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './ProductList.scss'

export default function ProductList() {
    const { t } = useTranslation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [confirmToggle, setConfirmToggle] = useState({ show: false, product: null })
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const { showToast } = useToast()

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(12)
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await productApi.getProducts()
            // Filter out toppings from main list if needed, or show all
            setProducts(data)
        } catch (error) {
            console.error('Failed to load products:', error)
            showToast(t('modal.load_error'), 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const handleCreate = () => {
        setSelectedProduct(null)
        setShowModal(true)
    }

    const handleEdit = (product) => {
        setSelectedProduct(product)
        setShowModal(true)
    }

    const handleToggleStatus = (product) => {
        setConfirmToggle({
            show: true,
            product
        })
    }

    const executeToggleStatus = async () => {
        const { product } = confirmToggle
        try {
            await productApi.toggleProductActive(product.id)
            showToast(product.isActive ? t('modal.status_inactive_alert', { name: product.name }) : t('modal.status_active_alert', { name: product.name }))
            loadProducts()
        } catch (error) {
            showToast(t('modal.action_failed'), 'error')
        } finally {
            setConfirmToggle({ show: false, product: null })
        }
    }

    const categories = ['All', ...new Set(products.map(p => p.category))]

    const filteredAndSortedProducts = useMemo(() => {
        let result = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.code.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
            return matchesSearch && matchesCategory
        })

        // Sort
        result.sort((a, b) => {
            const valA = a[sortConfig.key]
            const valB = b[sortConfig.key]

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [products, searchQuery, selectedCategory, sortConfig])

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredAndSortedProducts.slice(start, start + itemsPerPage)
    }, [filteredAndSortedProducts, currentPage, itemsPerPage])

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    if (loading && products.length === 0) {
        return <LoadingSpinner fullScreen />
    }

    return (
        <div className="product-list-page">
            <div className="page-header">
                <div className="title-section">
                    <p className="subtitle">{t('nav.menu')}: {filteredAndSortedProducts.length}</p>
                </div>
                <div className="header-actions">
                    <SearchBar
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder={t('common.search_placeholder')}
                    />
                    <Select
                        className="category-select-wrapper"
                        value={selectedCategory}
                        onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        options={categories.map(cat => ({
                            value: cat,
                            label: cat === 'All' ? t('common.all_categories') : cat
                        }))}
                        placeholder={false}
                        fullWidth={false}
                    />

                    <button className="add-btn" onClick={handleCreate}>
                        <Icon name="plus" size={18} /> <span className="desktop-only">{t('action.add_new')}</span>
                    </button>
                </div>
            </div>

            <div className="products-container">
                {/* Sort Controls Bar */}
                <div className="sort-controls-bar">
                    <button
                        className={`sort-btn ${sortConfig.key === 'name' ? 'active' : ''}`}
                        onClick={() => requestSort('name')}
                    >
                        <Icon name="type" size={14} />
                        {t('form.product_name')} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        className={`sort-btn ${sortConfig.key === 'code' ? 'active' : ''}`}
                        onClick={() => requestSort('code')}
                    >
                        <Icon name="hash" size={14} />
                        {t('form.product_code')} {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        className={`sort-btn ${sortConfig.key === 'price' ? 'active' : ''}`}
                        onClick={() => requestSort('price')}
                    >
                        <Icon name="dollar-sign" size={14} />
                        {t('form.price')} {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                </div>

                {paginatedProducts.length > 0 ? (
                    <div className="products-grid">
                        {paginatedProducts.map(product => (
                            <div
                                key={product.id}
                                className={`product-card-admin glass-card ${!product.isActive ? 'is-inactive' : ''}`}
                                onClick={() => handleEdit(product)}
                            >
                                <div className="card-thumb" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                                    {!product.isActive && <div className="status-overlay">{t('status.removed')}</div>}
                                    {product.isTopping && <div className="topping-tag">{t('nav.topping')}</div>}
                                </div>
                                <div className="card-content">
                                    <div className="card-info-header">
                                        <Badge variant="info" size="xs">{product.category}</Badge>
                                        <span className="product-code">{product.code}</span>
                                    </div>
                                    <div className="card-info-main">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="price-tag-big">
                                            <span className="label-price">{t('form.price')}</span>
                                            <span className="value">{formatPrice(product.price, true)}</span>
                                        </div>
                                    </div>
                                    <div className="card-info-footer">
                                        <div className="cost-badge">
                                            <span className="label">{t('common.cost')}</span>
                                            <span className="value">{formatPrice(product.cost, true)}</span>
                                        </div>
                                        <div className="edit-indicator">
                                            <Icon name="edit" size={14} />
                                            <span>{t('action.edit')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-container">
                        <Icon name="coffee" size={48} />
                        <h3>{t('common.no_data')}</h3>
                        <p>{t('modal.no_result')}</p>
                        <button className="text-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setCurrentPage(1); }}>{t('modal.clear_search')}</button>
                    </div>
                )}

                {filteredAndSortedProducts.length > 0 && (
                    <Pagination
                        totalItems={filteredAndSortedProducts.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                )}
            </div>

            {showModal && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        setShowModal(false)
                        loadProducts()
                    }}
                />
            )}

            <ConfirmModal
                show={confirmToggle.show}
                title={t('modal.confirm_status_title')}
                message={t('modal.confirm_status_msg', { name: confirmToggle.product?.name })}
                onConfirm={executeToggleStatus}
                onCancel={() => setConfirmToggle({ show: false, product: null })}
                confirmText={confirmToggle.product?.isActive ? t('modal.confirm_disable') : t('modal.confirm_enable')}
                type={confirmToggle.product?.isActive ? 'danger' : 'default'}
            />
        </div>
    )
}
