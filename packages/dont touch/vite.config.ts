// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        exclude: ['@tailwindcss/vite', 'tailwindcss', '@tailwindcss/oxide', 'lightningcss'],
        esbuildOptions: {
            target: 'esnext',
        },
    },
    plugins: [
        tailwindcss(),
        tsConfigPaths(),
        tanstackStart(),
        // react's vite plugin must come after start's vite plugin
        viteReact(),
    ],
})
