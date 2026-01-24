import { useEffect, useRef } from 'react'
import useDebounce from './useDebounce'

/**
 * useAutoSave hook
 * Automatically calls a save function when dependencies change, after a debounce delay.
 * Or can simply wrap the logic using useDebounce inside.
 *
 * @param {Function} saveCallback - The function to call to save data
 * @param {any} data - The data to watch for changes (or array of deps)
 * @param {number} delay - Debounce delay in ms, default 3000
 */
export default function useAutoSave(saveCallback, data, delay = 3000) {
    const savedCallback = useRef(saveCallback)
    // Keep callback ref up to date
    useEffect(() => {
        savedCallback.current = saveCallback
    }, [saveCallback])

    // Debounce the data reference itself or relies on parent to pass a stable object?
    // Actually, simple way: Debounce the effect of changing data.

    // We can just rely on useEffect + setTimeout cleanup (which is essentially what useDebounce does)
    // But we want to trigger a side effect (saving) NOT return a value.

    useEffect(() => {
        const handler = setTimeout(() => {
            savedCallback.current(data)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
        // ESLint might complain if data is an object, but we assume user passes stable deps or acceptable re-renders
        // If data is just a trigger, it works.
    }, [data, delay])
}
