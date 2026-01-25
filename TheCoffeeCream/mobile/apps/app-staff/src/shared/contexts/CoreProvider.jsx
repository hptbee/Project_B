import { BaseCoreProvider } from '@thecoffeecream/ui-shared'
import { CartProvider } from './CartContext'
import { ProductProvider } from './ProductContext'

/**
 * Composite provider to wrap the application in all necessary contexts
 */
export function CoreProvider({ children }) {
    return (
        <BaseCoreProvider>
            <CartProvider>
                <ProductProvider>
                    {children}
                </ProductProvider>
            </CartProvider>
        </BaseCoreProvider>
    )
}
