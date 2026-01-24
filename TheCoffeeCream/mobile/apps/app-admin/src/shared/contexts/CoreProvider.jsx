import React from 'react'
import { AuthProvider, ThemeProvider, UIProvider, Toast } from '@thecoffeecream/ui-shared'

export const CoreProvider = ({ children }) => {
    return (
        <ThemeProvider>
            <UIProvider ToastComponent={Toast}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </UIProvider>
        </ThemeProvider>
    )
}
