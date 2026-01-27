import React, { useState } from 'react';
import { useTranslation } from '@thecoffeecream/ui-shared';
import './PrintBillModal.scss';

export default function PrintBillModal({ show, onConfirm, onCancel, tableName }) {
    const { t } = useTranslation();
    const [selectedLang, setSelectedLang] = useState('vi');

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-container print-confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{t('common.print_confirm_title')}</span>
                    <button className="close-btn" onClick={onCancel}>✕</button>
                </div>
                <div className="modal-body">
                    <p className="confirm-msg">
                        {t('common.print_confirm_msg', { name: tableName })}
                    </p>

                    <div className="language-selection">
                        <label className="section-label">{t('common.select_print_lang')}:</label>
                        <div className="lang-options">
                            <button
                                className={`lang-btn ${selectedLang === 'vi' ? 'active' : ''}`}
                                onClick={() => setSelectedLang('vi')}
                            >
                                <span className="flag">🇻🇳</span>
                                <span className="label">{t('common.vi_lang')}</span>
                            </button>
                            <button
                                className={`lang-btn ${selectedLang === 'en' ? 'active' : ''}`}
                                onClick={() => setSelectedLang('en')}
                            >
                                <span className="flag">🇺🇸</span>
                                <span className="label">{t('common.en_lang')}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel btn-secondary" onClick={onCancel}>
                        {t('action.cancel')}
                    </button>
                    <button className="btn-confirm btn-primary" onClick={() => onConfirm(selectedLang)}>
                        {t('common.print')}
                    </button>
                </div>
            </div>
        </div>
    );
}
