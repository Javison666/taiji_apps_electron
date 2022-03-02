import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import BackServiceApp from 'client/workbench/apps/backService/index'

class BackServiceMain {

	public static readonly INSTANCE = new BackServiceMain()

	async main(): Promise<void> {
		try {
			await this.startup();
			this.processHeart()
		} catch (error) {
			Logger.INSTANCE.error('BackServiceMain.main', error.message);
		}
	}

	private async startup(): Promise<void> {
		await BackServiceApp.INSTANCE.main()
	}

	async processHeart() {
		setTimeout(() => {
			Logger.INSTANCE.info(AppItemName.Back_Service, 'process_heart')
			this.processHeart()
		}, 60000)
	}
}


export async function main(): Promise<void> {
	Logger.INSTANCE.init(AppItemName.Back_Service)
	await BackServiceMain.INSTANCE.main();
}

