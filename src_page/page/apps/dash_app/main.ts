import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import '@/style/index.css'

async function main(): Promise<void> {

	await client.ipcMessagePort.connectApp('Shared_Process')

	const app = createApp(App)
	app.use(router)
	app.mount('#app')
}

main()
