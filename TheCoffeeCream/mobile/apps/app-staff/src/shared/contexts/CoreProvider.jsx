import React from 'react'
import { ThemeProvider } from './ThemeContext'
import { AuthProvider } from './AuthContext'
import { CartProvider } from './CartContext'
import { UIProvider } from './UIContext'
import { ProductProvider } from './ProductContext'

/**
 * Composite provider to wrap the application in all necessary contexts
 */
export const CoreProvider = ({ children }) => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <UIProvider>
                        <ProductProvider>
                            {children}
                        </ProductProvider>
                    </UIProvider>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
