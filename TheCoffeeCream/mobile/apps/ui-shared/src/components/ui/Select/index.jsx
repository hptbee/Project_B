import React from 'react';
import './Select.scss';
import { IconChevron } from '../../ui/IconChevron';

/**
 * Premium Select component for a consistent look and feel across the app.
 */
export const Select = ({
    label,
    options = [],
    value,
    onChange,
    error,
    placeholder = 'Chọn một tùy chọn...',
    fullWidth = true,
    required = false,
    className = '',
    name
}) => {
    return (
        <div className={`select-container ${fullWidth ? 'full-width' : ''} ${error ? 'has-error' : ''} ${className}`}>
            {label && (
                <label className="select-label">
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            <div className="select-wrapper">
                <select
                    className="select-input"
                    value={value}
                    onChange={onChange}
                    required={required}
                    name={name}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="select-arrow">
                    <IconChevron direction="down" size={16} />
                </div>
            </div>
            {error && <span className="select-error">{error}</span>}
        </div>
    );
};
