import { app } from 'electron';
import { IAppConfiguraiton, AppItemName, IAppType } from 'client/workbench/protocals/commonProtocal'
// import { runApp } from 'client/workbench/apps/index'
import Logger from 'client/platform/environment/node/logger'
import ClientApplication from 'client/entry/electron_main/app';
import runApp from 'client/workbench/apps';

class DashBench {

	public static readonly INSTANCE = new DashBench();

	private static appList: IAppConfiguraiton[] = []

	private appConf: IAppConfiguraiton = {
		appName: AppItemName.Sys_Dash_App,
		querys: '',
		appType: IAppType.Share_Web,
		browserOpt: {
			width: 800,
			height: 600,
		}
	}

	main(): void {
		try {
			this.startup();
		} catch (error) {
			Logger.INSTANCE.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {
		Logger.INSTANCE.info('DashBench startup success!')

		await this.udtAppList()
		this.enterDashUI()
	}

	public async udtAppList(): Promise<void> {
		DashBench.appList = ClientApplication.INSTANCE.appList
	}

	public enterDashUI(): void {

		const appLength = DashBench.appList.length
		if (appLength === 0) {
			// 未授权
			return
		}
		if (appLength === 1) {
			// 直接进入
			runApp(DashBench.appList[0])
			return
		}
		// 创建dash ui
		runApp(DashBench.INSTANCE.appConf)

	}
}

export default DashBench
