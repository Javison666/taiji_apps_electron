import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import TTcodeApp from 'client/workbench/apps/ttcode';

class TTcodeMain {

	public static readonly INSTANCE = new TTcodeMain()

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			Logger.INSTANCE.error('TTcodeMain.main', error.message);
		}
	}

	private async startup(): Promise<void> {
		await TTcodeApp.INSTANCE.main()
	}
}


export async function main(): Promise<void> {
	Logger.INSTANCE.init(AppItemName.TTcode_App)
	await TTcodeMain.INSTANCE.main();
}

