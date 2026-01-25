import { SideMenu, useMenu, useAuth, useTranslation } from '@thecoffeecream/ui-shared'
import TopBar from './TopBar'
import logo from '../../../assets/icons/logo.png'
import './MainLayout.scss'

export default function MainLayout({ children }) {
    const { isOpen, toggle } = useMenu()
    const { isAuthenticated } = useAuth()
    const { t } = useTranslation()

    const menuItems = [
        { to: '/', icon: 'chart', label: t('nav.overview') },
        { to: '/orders', icon: 'history', label: t('nav.invoices') },
        { to: '/products', icon: 'coffee', label: t('nav.menu') },
        { to: '/users', icon: 'users', label: t('nav.hr') },
    ]

    // If not authenticated, just render children (which will be the Login page)
    if (!isAuthenticated) {
        return <main className="auth-container">{children}</main>
    }

    return (
        <div className={`main-layout ${isOpen ? 'menu-open' : ''}`}>
            <SideMenu
                items={menuItems}
                logo={logo}
                footer="Admin v1.0.0"
            />
            <div className="layout-content">
                <TopBar onMenuClick={toggle} />
                <main className="page-container">
                    {children}
                </main>
            </div>
        </div>
    )
}
