import { useState } from 'react'
import { useTranslation, formatPrice } from '@thecoffeecream/ui-shared'

export default function SplitTableModal({
    show,
    onClose,
    onConfirm,
    currentTableId,
    items,
    allTables
}) {
    const { t } = useTranslation()
    const [selectedKeys, setSelectedKeys] = useState([])
    const [targetTableId, setTargetTableId] = useState('')

    if (!show) return null

    const availableTables = allTables.filter(t => t.id !== currentTableId)

    const toggleItem = (key) => {
        setSelectedKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )
    }

    const handleConfirm = () => {
        if (selectedKeys.length > 0 && targetTableId) {
            onConfirm(targetTableId, selectedKeys)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">Tách bàn / Chuyển món</span>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflow: 'hidden' }}>

                    <div className="items-selection-section" style={{ flex: 1, overflowY: 'auto' }}>
                        <p style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>1. Chọn món muốn chuyển:</p>
                        <div className="split-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(item => (
                                <div
                                    key={item.key}
                                    className={`split-item-row ${selectedKeys.includes(item.key) ? 'selected' : ''}`}
                                    onClick={() => toggleItem(item.key)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)',
                                        background: selectedKeys.includes(item.key) ? 'var(--accent-glass)' : 'var(--bg-card)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div className="checkbox" style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '4px',
                                        border: '2px solid var(--accent-color)',
                                        background: selectedKeys.includes(item.key) ? 'var(--accent-color)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px'
                                    }}>
                                        {selectedKeys.includes(item.key) && '✓'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.product.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {item.qty} x {formatPrice(item.product.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="target-selection-section">
                        <p style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>2. Chọn bàn đích:</p>
                        <div className="table-selector-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px',
                            maxHeight: '150px',
                            overflowY: 'auto'
                        }}>
                            {availableTables.map(table => (
                                <button
                                    key={table.id}
                                    className={`table-select-btn ${targetTableId === table.id ? 'active' : ''}`}
                                    onClick={() => setTargetTableId(table.id)}
                                    style={{
                                        padding: '8px 4px',
                                        borderRadius: '8px',
                                        border: targetTableId === table.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                        background: targetTableId === table.id ? 'var(--accent-glass)' : 'var(--bg-card)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    {table.name}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>{t('cart.back')}</button>
                    <button
                        className="btn-primary"
                        disabled={selectedKeys.length === 0 || !targetTableId}
                        onClick={handleConfirm}
                    >
                        {t('action.confirm')}
                    </button>
                </div>
            </div>
        </div>
    )
}
