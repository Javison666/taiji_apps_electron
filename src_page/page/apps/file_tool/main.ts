import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'src_page/page/style/index.css'
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import Logger from 'src/client/platform/environment/node/logger'

window.PageLoaded = true
Logger.INSTANCE.init(AppItemName.Test_Qn)

async function main(): Promise<void> {

	if (window.client) {
		await window.client.ipcMessagePort.connectApp(AppItemName.Shared_Process)
	}

	const app = createApp(App)
	app.use(router)
	app.mount('#app')

}

main()
