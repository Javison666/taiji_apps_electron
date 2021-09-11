import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'src_page/page/style/index.css'
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'

window.PageLoaded = true

async function main(): Promise<void> {

	if(window.client){
		await window.client.ipcMessagePort.connectApp(AppItemName.Shared_Process)
	}

	const app = createApp(App)
	app.use(router)
	app.mount('#app')
}

main()
