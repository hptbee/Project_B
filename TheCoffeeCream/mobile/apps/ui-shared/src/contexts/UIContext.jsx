import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const UIContext = createContext()

/**
 * UIProvider - Manages global UI state (menu, toast)
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {React.ComponentType} props.ToastComponent - The component used to render toasts
 */
export function UIProvider({ children, ToastComponent: Toast }) {
    // Menu state
    const [menuOpen, setMenuOpen] = useState(false)

    // Toast state
    const [toast, setToast] = useState({ message: '', visible: false })
    const toastTimer = useRef()

    // Menu actions
    const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])
    const closeMenu = useCallback(() => setMenuOpen(false), [])
    const openMenu = useCallback(() => setMenuOpen(true), [])

    // Toast actions
    const showToast = useCallback((message, optionsOrType = 'success', duration = 3000) => {
        clearTimeout(toastTimer.current)

        // Handle backward compatibility: if second arg is string, treat as type
        let type = 'success'
        let action = null
        let customDuration = duration

        if (typeof optionsOrType === 'string') {
            type = optionsOrType
        } else if (typeof optionsOrType === 'object') {
            type = optionsOrType.type || 'success'
            action = optionsOrType.action
            if (optionsOrType.duration) customDuration = optionsOrType.duration
        }

        setToast({ message, visible: true, type, action })

        // Only auto-hide if there is NO action required
        if (!action) {
            toastTimer.current = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }))
            }, customDuration)
        }
    }, [])

    const value = {
        // Menu
        menuOpen,
        toggleMenu,
        closeMenu,
        openMenu,
        // Toast
        showToast
    }

    return (
        <UIContext.Provider value={value}>
            {children}
            {Toast && <Toast message={toast.message} visible={toast.visible} />}
        </UIContext.Provider>
    )
}

/**
 * Hook to access UI context
 */
export function useUI() {
    const context = useContext(UIContext)
    if (!context) {
        throw new Error('useUI must be used within UIProvider')
    }
    return context
}

/**
 * Hook to access menu state and actions
 */
export function useMenu() {
    const { menuOpen, toggleMenu, closeMenu, openMenu } = useUI()
    return { isOpen: menuOpen, toggle: toggleMenu, close: closeMenu, open: openMenu }
}

/**
 * Hook to show toast notifications
 */
export function useToast() {
    const { showToast } = useUI()
    return { showToast }
}
