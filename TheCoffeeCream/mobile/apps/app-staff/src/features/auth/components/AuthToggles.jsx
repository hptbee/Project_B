import React from 'react'
import { ThemeToggle, LanguageToggle } from '@thecoffeecream/ui-shared'
import './AuthToggles.scss'

export default function AuthToggles() {
    return (
        <div className="auth-toggles">
            <LanguageToggle />
            <ThemeToggle />
        </div>
    )
}
