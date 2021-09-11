import { ipcRenderer } from 'electron';
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import AppsService from 'client/workbench/services/appsService'
import UtilService from 'client/workbench/services/utilService'
import FileHistoryService from 'client/workbench/services/fileHistoryService'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import ShareStorage from 'client/base/parts/storage/node/shareStorage'
import Logger from 'client/platform/environment/node/logger'

import BizShareProcess from 'client/workbench/apps/bizShareProcess'


class SharedProcessMain {
	async open(): Promise<void> {
		this.registerListeners()
		// Services
		await this.initServices();
	}

	private async initServices(): Promise<void> {
		await StaticPageResourceServer.INSTANCE.main()
		await ShareStorage.INSTANCE.main()
		// 该服务暂时在share与主线程同时运行
		await AppsService.INSTANCE.main()
		await UtilService.INSTANCE.main()
		await FileHistoryService.INSTANCE.main()
		this.processHeart()
	}

	private registerListeners(): void {
		BizShareProcess.INSTANCE.main()
	}

	async processHeart() {
		setTimeout(() => {
			Logger.INSTANCE.info('share process_heart')
			this.processHeart()
		}, 60000)
	}
}

export async function main(): Promise<void> {

	Logger.INSTANCE.init(AppItemName.Shared_Process)

	// create shared process and signal back to main that we are
	// ready to accept message ports as client connections
	const sharedProcess = new SharedProcessMain();
	await sharedProcess.open();
	ipcRenderer.send('client:shared-process->electron-main=ipc-ready', {
		staticServerPort: StaticPageResourceServer.INSTANCE.port
	});

	// await initialization and signal this back to electron-main

	// console.log('ipcRenderer presend share-init-done')
	// ipcRenderer.send('client:shared-process->electron-main=init-done', {
	// 	staticServerPort: StaticPageResourceServer.INSTANCE.port
	// });

}

