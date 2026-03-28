import { useState } from 'react'
import { useTranslation, IconChevron } from '@thecoffeecream/ui-shared'

export default function MergeTableModal({
    show,
    onClose,
    onConfirm,
    currentTableId,
    allTables
}) {
    const { t } = useTranslation()
    const [targetTableId, setTargetTableId] = useState('')

    if (!show) return null

    // Filter out current table
    const availableTables = allTables.filter(t => t.id !== currentTableId)

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">Gộp bàn</span>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <p style={{ marginBottom: '1rem' }}>Chọn bàn muốn gộp <b>Bàn {currentTableId}</b> vào:</p>
                    <div className="table-selector-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '10px 2px'
                    }}>
                        {availableTables.map(table => (
                            <button
                                key={table.id}
                                className={`table-select-btn ${targetTableId === table.id ? 'active' : ''} ${table.active ? 'has-order' : ''}`}
                                onClick={() => setTargetTableId(table.id)}
                                style={{
                                    padding: '12px 8px',
                                    borderRadius: '12px',
                                    border: targetTableId === table.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                    background: targetTableId === table.id ? 'var(--accent-glass)' : 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                            >
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>{table.name}</span>
                                {table.active && (
                                    <span style={{
                                        fontSize: '10px',
                                        background: 'var(--info-color)',
                                        color: 'white',
                                        padding: '1px 4px',
                                        borderRadius: '4px'
                                    }}>
                                        Đang có đơn
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>{t('cart.back')}</button>
                    <button
                        className="btn-primary"
                        disabled={!targetTableId}
                        onClick={() => onConfirm(targetTableId)}
                    >
                        {t('action.confirm')}
                    </button>
                </div>
            </div>
        </div>
    )
}
