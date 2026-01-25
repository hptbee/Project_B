import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { UIProvider } from './UIContext';
import { Toast } from '../components/ui/Toast';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';

/**
 * BaseCoreProvider consolidates shared context providers
 * used by all applications in the project.
 */
export const BaseCoreProvider = ({ children }) => {
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
    );
};
