import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { outDir, appNames } from './build/env'
const { resolve } = require('path')

let rollupOptions: { input: { [key: string]: string } } = {
  input: {}
}
appNames.forEach(appName => {
  rollupOptions.input[appName] = resolve(__dirname, `page/apps/${appName}/index.html`)
})

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000
  },
  resolve: {
    alias: {
      // 'vue': 'vue/dist/vue.esm-bundler.js',
      "src": resolve(__dirname, '../', 'src'),
      'src_page': resolve(__dirname, '../', 'src_page'),
    },
  },
  plugins: [vue()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions
  }
})
