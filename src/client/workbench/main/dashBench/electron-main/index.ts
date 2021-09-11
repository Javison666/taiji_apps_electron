import { app } from 'electron';
import { IAppConfiguraiton, AppItemName, IAppType } from 'client/workbench/protocals/commonProtocal'
// import { runApp } from 'client/workbench/apps/index'
import Logger from 'client/platform/environment/node/logger'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import AppsService from 'client/workbench/services/appsService'
import createAppWindow from 'client/workbench/utils/createAppWindow'

class DashBench {

	public static readonly INSTANCE = new DashBench();

	private static appList: IAppConfiguraiton[] = []

	private appConf: IAppConfiguraiton = {
		appName: AppItemName.Dash_App,
		querys: '',
		appType: IAppType.Client_Web,
		browserOpt: {
			width: 800,
			height: 600,
			webPreferences: {
				maximizable: false,
				minimizable: false,
				fullscreenable: false,
			}
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
		DashBench.appList = AppsService.INSTANCE.appsConfigurationList
	}

	public enterDashUI(): void {

		const appLength = DashBench.appList.length
		if (appLength === 0) {
			// 未授权
			return
		}
		// if (appLength === 1) {
		// 	// 直接进入
		// 	runApp(DashBench.appList[0])
		// 	return
		// }
		// 创建dash ui
		let uri = StaticPageResourceServer.INSTANCE.getAppNameServerAddr(this.appConf)
		createAppWindow({
			appName: AppItemName.Dash_App,
			loadURI: uri,
			readyShow: true
		})

	}
}

export default DashBench
