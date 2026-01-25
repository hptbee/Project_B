import React from 'react'
import { AuthProvider, ThemeProvider, UIProvider, Toast, LanguageProvider } from '@thecoffeecream/ui-shared'

export const CoreProvider = ({ children }) => {
    return (
        <ThemeProvider>
            <UIProvider ToastComponent={Toast}>
                <LanguageProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </LanguageProvider>
            </UIProvider>
        </ThemeProvider>
    )
}
