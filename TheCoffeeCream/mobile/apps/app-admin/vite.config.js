import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@ui-shared': path.resolve(__dirname, '../ui-shared/src')
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://localhost:7019',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['@thecoffeecream/ui-shared']
                }
            }
        }
    }
})
