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
    const showToast = useCallback((message, duration = 1400) => {
        clearTimeout(toastTimer.current)
        setToast({ message, visible: true })
        toastTimer.current = setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }))
        }, duration)
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
