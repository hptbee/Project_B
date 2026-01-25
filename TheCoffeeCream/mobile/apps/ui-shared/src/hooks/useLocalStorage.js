import { useState, useEffect } from 'react'

/**
 * useLocalStorage hook
 * Persists state to localStorage and synchronizes it.
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no data in storage
 * @returns {[any, Function]} - [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue]
}
