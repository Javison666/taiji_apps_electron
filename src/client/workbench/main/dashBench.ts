import { app, BrowserWindow } from 'electron';
import { IAppConfiguraiton, IAppType, AppItemName } from 'client/workbench/apps/appsEnum'
import { runApp } from 'client/workbench/apps/index'
import logger from 'client/common/log'
import { fileFromClientResource } from 'client/base/common/network'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'

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
			appName: AppItemName.Sprotect,
			startWidth: 540,
			startHeight: 400,
			appType: IAppType.Client_Web
		}, {
			appName: AppItemName.Encrypt_Decode,
			startWidth: 540,
			startHeight: 400,
			appType: IAppType.Share_Web
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
		// 创建dash ui
		logger.info(`dash startup success!`)
		const win = new BrowserWindow({
			show: false,
			width: 800,
			height: 600,
			webPreferences: {
				webSecurity: false,
				preload: fileFromClientResource('client/base/parts/sandbox/electron_browser/preload.js'),
				additionalArguments: [`--client-window-config=${fileFromClientResource('').toString()}`, `--app-name=${AppItemName.Dash_App}`],
				nodeIntegration: true,
				contextIsolation: false,
				nativeWindowOpen: true,
			}
		})
		win.menuBarVisible = false
		win.once('ready-to-show', () => {
			win.show()
		})
		win.loadURL(StaticPageResourceServer.INSTANCE.getAppNameServerAddr(AppItemName.Dash_App))
		win.webContents.openDevTools();
	}
}

export default DashBench
