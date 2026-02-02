import React, { createContext, useContext, useReducer } from 'react'
import { generateCartItemKey, generateOrderId, useLocalStorage } from '@thecoffeecream/ui-shared'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            const { product, qty = 1, toppings = [], note = '' } = action.payload
            const key = generateCartItemKey(product, toppings, note)
            const existing = state.items.find(i => i.key === key)
            if (existing) {
                return { ...state, items: state.items.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i) }
            }
            return { ...state, items: [...state.items, { key, product, qty, toppings, note }] }
        }
        case 'SYNC_DRAFT_FROM_SERVER': {
            const { tableId, order } = action.payload

            // Map Server Order Items -> Cart Items
            // We need to reconstruct keys and product objects (minimal)
            const syncedItems = order.items.map(serverItem => {
                // We need to map basic product details. serverItem lacks some product data like image/category 
                // but for cart display title/price is mostly enough.
                // Ideally we should lookup from ProductContext, but standard cart usage embeds product.
                // We construct a 'product' object from serverItem.
                const product = {
                    id: serverItem.productId,
                    title: serverItem.name,
                    price: serverItem.unitPrice,
                }

                const toppings = (serverItem.selectedToppings || []).map(t => ({
                    id: t.id,
                    title: t.name,
                    price: t.price,
                    code: t.code,
                    isTopping: true
                }))

                const key = generateCartItemKey(product, toppings, serverItem.note || '')

                return {
                    key,
                    product,
                    qty: serverItem.quantity,
                    toppings,
                    note: serverItem.note || ''
                }
            })

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: {
                        items: syncedItems,
                        orderId: order.id,
                        clientOrderId: order.clientOrderId,
                        status: 'DRAFT',
                        customer: null, // Server might not store customer name in simple order object yet if not in DTO
                        createdAt: order.createdAt,
                        note: order.note
                    }
                }
            }
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
            const key = generateCartItemKey(product, toppings, note)
            const table = state.tables[tableId] || {
                items: [],
                orderId: generateOrderId(),
                clientOrderId: crypto.randomUUID(),
                status: 'DRAFT',
                customer: null,
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
        case 'UPDATE_ITEM_TABLE': {
            const { tableId, oldKey, qty, toppings, note } = action.payload
            const table = state.tables[tableId]
            if (!table) return state

            const originalItem = table.items.find(i => i.key === oldKey)
            if (!originalItem) return state

            const newKey = generateCartItemKey(originalItem.product, toppings, note)

            // Re-map items: remove old, add/merge new
            const baseItems = table.items.filter(i => i.key !== oldKey)
            const existingWithNewKey = baseItems.find(i => i.key === newKey)

            const updatedItems = existingWithNewKey
                ? baseItems.map(i => i.key === newKey ? { ...i, qty: i.qty + qty, note, toppings } : i)
                : [...baseItems, { ...originalItem, key: newKey, qty, toppings, note }]

            return {
                ...state,
                tables: {
                    ...state.tables,
                    [tableId]: { ...table, items: updatedItems }
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
                    customer: null,
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
        customer: null
    }
}

export function useTableCartDispatch(tableId) {
    const dispatch = useContext(CartDispatchContext)
    return (action) => {
        // Automatically inject tableId into the action
        dispatch({ ...action, payload: { ...action.payload, tableId } })
    }
}
