import { app } from 'electron';
import { IAppConfiguraiton, AppItemName } from 'client/workbench/apps/appsEnum'
import { runApp } from 'client/workbench/apps/index'
import logger from 'client/common/log'

class DashBench {

	public static readonly INSTANCE = new DashBench();



	static appList: IAppConfiguraiton[] = []

	main(): void {
		try {
			this.startup();
		} catch (error) {
			console.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {
		logger.info('DashBench startup success!')

		await this.udtAppList()
		this.enterDashUI()
	}

	public async udtAppList(): Promise<void> {
		DashBench.appList = [{
			app_name: AppItemName.Sprotect
		}]
	}

	public enterDashUI(): void {

		const appLength = DashBench.appList.length
		logger.info('appLength', appLength)
		if (appLength === 0) {
			// 未授权
			return
		}
		if (appLength === 1) {
			// 直接进入
			runApp(DashBench.appList[0])
			return
		}
		// 创建dashui
	}
}

export default DashBench
