import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactDatePicker from 'react-datepicker'
import { Icon } from '../Icon'
import 'react-datepicker/dist/react-datepicker.css'
import './DateRangePicker.scss'

export function DateRangePicker({ start, end, onApply, minDate, maxDate = new Date(), iconColor = 'var(--accent-amber)' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tempStart, setTempStart] = useState(new Date(start))
    const [tempEnd, setTempEnd] = useState(new Date(end))

    // Update internal state if props change while closed
    useEffect(() => {
        if (!isOpen) {
            setTempStart(new Date(start))
            setTempEnd(new Date(end))
        }
    }, [start, end, isOpen])

    const handleApply = () => {
        if (tempStart && tempEnd) {
            onApply({ start: tempStart, end: tempEnd })
            setIsOpen(false)
        }
    }

    return (
        <div className="custom-daterange-picker">
            <button
                className={`daterange-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <Icon name="history" size={18} color={iconColor} />
                <div className="range-display">
                    <span className="date">{new Date(start).toLocaleDateString('vi-VN')}</span>
                    <Icon name="chevronRight" size={12} className="sep" />
                    <span className="date">{new Date(end).toLocaleDateString('vi-VN')}</span>
                </div>
            </button>

            {isOpen && createPortal(
                <div className="datepicker-overlay" onClick={() => setIsOpen(false)}>
                    <div className="datepicker-modal range-modal" onClick={e => e.stopPropagation()}>
                        <div className="datepicker-header">
                            <h3>Chọn khoảng thời gian</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                        <div className="range-inputs-unified">
                            <ReactDatePicker
                                selected={tempStart}
                                onChange={(dates) => {
                                    const [s, e] = dates
                                    setTempStart(s)
                                    setTempEnd(e)
                                }}
                                startDate={tempStart}
                                endDate={tempEnd}
                                selectsRange
                                inline
                                minDate={minDate}
                                maxDate={maxDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                className="apply-btn"
                                onClick={handleApply}
                                disabled={!tempStart || !tempEnd}
                            >
                                Hoàn tất
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
