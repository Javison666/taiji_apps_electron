import Logger from 'client/platform/environment/node/logger'
import { fileFromClientResource } from 'client/base/common/network'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import createAppWindow from 'client/workbench/utils/createAppWindow'

class BackService {

	public static readonly INSTANCE = new BackService()

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		Logger.INSTANCE.info(`BackService startup success!`)
		await this.createWindow()
	}

	private async createWindow() {
		createAppWindow({
			appName: AppItemName.Back_Service,
			loadURI: fileFromClientResource('client/workbench/apps/backService/electron-main/index.html')
		})
	}

}

export default BackService
