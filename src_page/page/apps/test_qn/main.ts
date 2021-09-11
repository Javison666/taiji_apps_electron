import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'src_page/page/style/index.css'
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import MockWsServer from 'src_page/page/apps/test_qn/services/mockWsServer'
import Logger from 'src/client/platform/environment/node/logger'

window.PageLoaded = true
Logger.INSTANCE.init(client.app.appName)

async function main(): Promise<void> {

	if(window.client){
		await window.client.ipcMessagePort.connectApp(AppItemName.Shared_Process)
	}

	MockWsServer.INSTANCE.main()

	const app = createApp(App)
	app.use(router)
	app.mount('#app')

}

main()
