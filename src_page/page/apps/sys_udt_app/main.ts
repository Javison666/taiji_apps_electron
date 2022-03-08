import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import 'src_page/page/style/index.css'
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import Logger from 'src/client/platform/environment/node/logger'
import render from './render'

window.PageLoaded = true
Logger.INSTANCE.init(AppItemName.Sys_Udt_App)

/**
 * //@type {import('../../../../src/client/base/parts/sandbox/electron-sandbox/globals')}
 */

async function main(): Promise<void> {

	await client.ipcMessagePort.connectApp(AppItemName.Shared_Process)

	const app = createApp(App)
	app.use(router)
	app.mount('#app')

	render()
}

main()
