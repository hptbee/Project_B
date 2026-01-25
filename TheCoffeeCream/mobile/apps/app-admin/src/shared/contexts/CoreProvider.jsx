import { BaseCoreProvider } from '@thecoffeecream/ui-shared'

export const CoreProvider = ({ children }) => {
    return (
        <BaseCoreProvider>
            {children}
        </BaseCoreProvider>
    )
}
