import { useEffect, useRef } from 'react'

/**
 * useAutoSave hook
 * Automatically calls a save function when dependencies change, after a debounce delay.
 *
 * @param {Function} saveCallback - The function to call to save data
 * @param {any} data - The data to watch for changes (or array of deps)
 * @param {number} delay - Debounce delay in ms, default 3000
 */
export default function useAutoSave(saveCallback, data, delay = 3000) {
    const savedCallback = useRef(saveCallback)

    useEffect(() => {
        savedCallback.current = saveCallback
    }, [saveCallback])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (savedCallback.current) {
                savedCallback.current(data)
            }
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [data, delay])
}
