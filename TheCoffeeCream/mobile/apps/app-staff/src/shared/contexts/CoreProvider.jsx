import React from 'react'
import { AuthProvider, ThemeProvider, UIProvider, Toast } from '@thecoffeecream/ui-shared'
import { CartProvider } from './CartContext'
import { ProductProvider } from './ProductContext'

/**
 * Composite provider to wrap the application in all necessary contexts
 */
export function CoreProvider({ children }) {
    return (
        <ThemeProvider>
            <UIProvider ToastComponent={Toast}>
                <AuthProvider>
                    <CartProvider>
                        <ProductProvider>
                            {children}
                        </ProductProvider>
                    </CartProvider>
                </AuthProvider>
            </UIProvider>
        </ThemeProvider>
    )
}
