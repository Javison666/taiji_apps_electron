import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 'vue': 'vue/dist/vue.esm-bundler.js',
      "@": resolve(__dirname, "page"),
    },
  },
  plugins: [vue()],
  build: {
    outDir: '../out_page',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        template: resolve(__dirname, 'page/apps/dash_app/index.html'),
        sprotect: resolve(__dirname, 'page/apps/sprotect/index.html')
      }
    }
  }
})
