import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../out_page',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        template: resolve(__dirname, 'page/apps/template/index.html'),
        sprotect: resolve(__dirname, 'page/apps/sprotect/index.html')
      }
    }
  }
})
