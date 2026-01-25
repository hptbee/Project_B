import React from 'react'
import { AuthProvider, ThemeProvider, UIProvider, Toast, LanguageProvider } from '@thecoffeecream/ui-shared'
import { CartProvider } from './CartContext'
import { ProductProvider } from './ProductContext'

/**
 * Composite provider to wrap the application in all necessary contexts
 */
export function CoreProvider({ children }) {
    return (
        <ThemeProvider>
            <UIProvider ToastComponent={Toast}>
                <LanguageProvider>
                    <AuthProvider>
                        <CartProvider>
                            <ProductProvider>
                                {children}
                            </ProductProvider>
                        </CartProvider>
                    </AuthProvider>
                </LanguageProvider>
            </UIProvider>
        </ThemeProvider>
    )
}
