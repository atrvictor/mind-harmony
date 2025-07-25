import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { Plugin } from 'vite'

// ES Module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to set the page title
const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>Mind Harmony - Reclaim Your Inner Clarity.</title>`
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    htmlPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      'pages': path.resolve(__dirname, './src/pages'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '(components)': path.resolve(__dirname, './src/(components)'),
    }
  }
})
