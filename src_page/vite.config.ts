import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 'vue': 'vue/dist/vue.esm-bundler.js',
      "src": resolve(__dirname, '../', 'src'),
      'src_page': resolve(__dirname, '../', 'src_page'),
    },
  },
  plugins: [vue()],
  build: {
    outDir: '../out_page',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dash_app: resolve(__dirname, 'page/apps/dash_app/index.html'),
        test_qn: resolve(__dirname, 'page/apps/test_qn/index.html')
      }
    }
  }
})
