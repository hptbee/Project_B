import { BrowserRouter } from 'react-router-dom'
import { CoreProvider } from '@/shared/contexts/CoreProvider'
import MainLayout from '@/shared/components/layout/MainLayout'
import AppRoutes from './routes'

export default function App() {
    return (
        <BrowserRouter>
            <CoreProvider>
                <MainLayout>
                    <AppRoutes />
                </MainLayout>
            </CoreProvider>
        </BrowserRouter>
    )
}
