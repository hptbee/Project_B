import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../services/api/client'

const AuthContext = createContext()

/**
 * AuthProvider - Manages user authentication state
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('auth_token'))
    const [loading, setLoading] = useState(true)

    const login = useCallback(async (username, password) => {
        try {
            const response = await apiFetch('/Auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            })

            const { user: userData, token: userToken } = response
            setUser(userData)
            setToken(userToken)
            localStorage.setItem('auth_token', userToken)
            localStorage.setItem('auth_user', JSON.stringify(userData))
            return response
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
    }, [])

    useEffect(() => {
        const handleUnauthorized = () => {
            console.log('Session expired, logging out...')
            logout()
        }

        window.addEventListener('auth:unauthorized', handleUnauthorized)

        const savedUser = localStorage.getItem('auth_user')
        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (e) {
                console.error('Failed to parse saved user')
                logout()
            }
        }
        setLoading(false)

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized)
        }
    }, [token, logout])

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook to access Auth context
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
