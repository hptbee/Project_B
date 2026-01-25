import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import ReactDatePicker from 'react-datepicker'
import { Icon } from '../Icon'
import { useTranslation } from '../../../contexts/LanguageContext'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePicker.scss'

export function DatePicker({ selected, onChange, minDate, maxDate = new Date(), label, iconColor = 'var(--accent-amber)' }) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const displayLabel = label || t('common.pick_date')

    return (
        <div className="custom-datepicker">
            <button
                className={`datepicker-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <Icon name="history" size={18} color={iconColor} />
                <span>
                    {selected ? new Date(selected).toLocaleDateString(t('common.locale') === 'vi' ? 'vi-VN' : 'en-US') : displayLabel}
                </span>
            </button>

            {isOpen && createPortal(
                <div className="datepicker-overlay" onClick={() => setIsOpen(false)}>
                    <div className="datepicker-modal" onClick={e => e.stopPropagation()}>
                        <div className="datepicker-header">
                            <h3>{displayLabel}</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                        <ReactDatePicker
                            selected={new Date(selected)}
                            onChange={(date) => {
                                onChange(date)
                                setIsOpen(false)
                            }}
                            inline
                            minDate={minDate}
                            maxDate={maxDate}
                            dateFormat="dd/MM/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
