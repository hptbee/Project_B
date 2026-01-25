import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeContext = createContext()

/**
 * ThemeProvider - Manages Dark/Light mode state
 */
export function ThemeProvider({ children }) {
    // Default to dark mode (Premium)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('app-theme')
        return saved ? saved === 'dark' : true
    })

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev)
    }, [])

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('app-theme', theme)
    }, [isDarkMode])

    const value = {
        isDarkMode,
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

/**
 * Hook to access Theme context
 */
export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
