import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import './Toggles.scss'

export function ThemeToggle({ className = '', title }) {
    const { isDarkMode, toggleTheme } = useTheme()

    // Safety check
    if (!toggleTheme) return null;

    return (
        <div
            className={`toggle-switch ${isDarkMode ? 'active' : ''} ${className}`}
            onClick={toggleTheme}
            title={title || (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
        >
            <div className="knob">
                {isDarkMode ? '🌙' : '☀️'}
            </div>
        </div>
    )
}
