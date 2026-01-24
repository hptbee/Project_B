import React, { createContext, useContext, useReducer } from 'react'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

function generateOrderId() {
    const timestamp = Date.now().toString().slice(-4)
    return `11-${timestamp}`
}

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const { product, qty = 1, toppings = [], note = '' } = action.payload
            const key = `${product.id}:${toppings.map(t => `${t.id}x${t.qty || 1}`).join(',')}:${note}`
            const existing = state.items.find(i => i.key === key)
            if (existing) {
                return { ...state, items: state.items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) }
            }
            return { ...state, items: [...state.items, { key, product, qty, toppings, note }] }
        }
        case 'REMOVE': {
            return { ...state, items: state.items.filter(i => i.key !== action.payload.key) }
        }
        case 'SET_QTY': {
            const { key, qty } = action.payload
            return { ...state, items: state.items.map(i => i.key === key ? { ...i, qty } : i) }
        }
        case 'CLEAR': return { ...state, items: [] }

        // Table-specific actions
        case 'ADD_TO_TABLE': {
            const { tableId, product, qty = 1, toppings = [], note = '' } = action.payload
            const key = `${product.id}:${toppings.map(t => `${t.id}x${t.qty || 1}`).join(',')}:${note}`
            const table = state.tables[tableId] || {
                items: [],
                orderId: generateOrderId(),
                clientOrderId: crypto.randomUUID(),
                status: 'DRAFT',
                customer: 'Khách lẻ',
                createdAt: Date.now()
            }
            const existing = table.items.find(i => i.key === key)

            const updatedItems = existing
                ? table.items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
                : [...table.items, { key, product, qty, toppings, note }]

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: { ...table, items: updatedItems }
                }
            }
        }
        case 'REMOVE_FROM_TABLE': {
            const { tableId, key } = action.payload
            const table = state.tables[tableId]
            if (!table) return state

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: {
                        ...table,
                        items: table.items.filter(i => i.key !== key)
                    }
                }
            }
        }
        case 'UPDATE_QTY_TABLE': {
            const { tableId, key, qty } = action.payload
            const table = state.tables[tableId]
            if (!table) return state

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: {
                        ...table,
                        items: table.items.map(i => i.key === key ? { ...i, qty } : i)
                    }
                }
            }
        }
        case 'UPDATE_TABLE_NOTE': {
            const { tableId, note } = action.payload
            const table = state.tables[tableId]
            if (!table) {
                const newTable = {
                    items: [],
                    orderId: generateOrderId(),
                    clientOrderId: crypto.randomUUID(),
                    status: 'DRAFT',
                    customer: 'Khách lẻ',
                    createdAt: Date.now(),
                    note
                }
                return {
                    ...state,
                    tables: {
                        ...state.tables,
                        [tableId]: newTable
                    }
                }
            }
            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: { ...table, note }
                }
            }
        }
        case 'UPDATE_ITEM_NOTE': {
            const { tableId, key, note } = action.payload
            const table = state.tables[tableId]
            if (!table) return state

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: {
                        ...table,
                        items: table.items.map(i => i.key === key ? { ...i, note } : i)
                    }
                }
            }
        }
        case 'UPDATE_TABLE_STATUS': {
            const { tableId, status } = action.payload
            const table = state.tables[tableId]
            if (!table) return state
            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: { ...table, status }
                }
            }
        }
        case 'CLEAR_TABLE': {
            const { tableId } = action.payload
            const newTables = { ...state.tables }
            delete newTables[tableId]
            return { ...state, tables: newTables }
        }
        default: return state
    }
}

import useLocalStorage from '@/shared/hooks/useLocalStorage'

export function CartProvider({ children }) {
    const [savedState, setSavedState] = useLocalStorage('cart_state', { items: [], tables: {} })

    // We initialize reducer with savedState. 
    // Note: useReducer doesn't automatically sync back to savedState, we need an effect.
    // Also, if useLocalStorage changes (e.g. from another tab), we might want to sync? 
    // For now, simplest refactor of existing logic:
    const [state, dispatch] = useReducer(cartReducer, savedState)

    React.useEffect(() => {
        setSavedState(state)
    }, [state, setSavedState])

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
}

export function useCart() {
    return useContext(CartStateContext)
}

export function useCartDispatch() {
    return useContext(CartDispatchContext)
}

// Table-specific hooks
export function useTableCart(tableId) {
    const state = useContext(CartStateContext)
    return state.tables[tableId] || {
        items: [],
        orderId: null,
        clientOrderId: null,
        status: 'DRAFT',
        customer: 'Khách lẻ'
    }
}

export function useTableCartDispatch(tableId) {
    const dispatch = useContext(CartDispatchContext)
    return (action) => {
        // Automatically inject tableId into the action
        dispatch({ ...action, payload: { ...action.payload, tableId } })
    }
}
