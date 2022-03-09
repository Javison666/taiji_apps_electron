import { BrowserWindow, app, Menu, Tray } from 'electron'
// import { onUnexpectedError } from 'client/base/common/errors'
import Logger from 'client/platform/environment/node/logger'
import { AppItemName, IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import { SharedProcess } from 'client/platform/sharedProcess/electron-main/sharedProcess'
import LoginBench from 'client/workbench/main/loginBench/electron-main/index'
import { fileFromPublicResource } from 'client/base/common/network'
import DashBench from 'client/workbench/main/dashBench/electron-main'
import registerCommonEvent from 'client/entry/electron_main/registerEventHandle/registerCommonEvent'
import registerCustomerEvent from 'client/entry/electron_main/registerEventHandle/registerCustomerEvent'
import registerTTcodeEvent from 'client/entry/electron_main/registerEventHandle/registerTTcodeEvent'
/**
 * The main client application. There will only ever be one instance,
 * even if the user starts many instances (e.g. from the command line).
 */
export class ClientApplication {

	public static readonly INSTANCE = new ClientApplication();
	public windowAppsMap: Map<AppItemName, BrowserWindow> = new Map()
	public tray: Tray | null = null;

	public clientData = {
		staticServerPort: 0,
	};

	// public appList: IAppConfiguraiton[] = [{
	// 	appName: AppItemName.Hunter_App,
	// 	appNick: 'Hunter',
	// 	querys: '',
	// 	appType: IAppType.Share_Web,
	// 	browserOpt: {
	// 		width: 800,
	// 		height: 600
	// 	}
	// }]

	public appList: IAppConfiguraiton[] = [{
		appName: AppItemName.Notify_App,
		appNick: '通知渠道',
		querys: '',
		appType: IAppType.Share_Web,
		browserOpt: {
			width: 800,
			height: 600
		}
	}, {
		appName: AppItemName.Scan_Udt_App,
		appNick: '扫描变动',
		querys: '',
		appType: IAppType.Share_Web,
		browserOpt: {
			width: 800,
			height: 600
		}
	}, {
		appName: AppItemName.Sys_Udt_App,
		appNick: '软件更新',
		querys: '',
		appType: IAppType.Share_Web,
		isHideInList: true,
		browserOpt: {
			width: 336,
			height: 438,
			resizable: false
		}
	}]


	async startup(): Promise<void> {

		this.registerListeners()
		this.launchProcess()

		// logger.debug(`from: ${this.environmentMainService.appRoot}`);
		// logger.debug('args:', this.environmentMainService.args);

		// Main process server (electron IPC based)
		// const mainProcessElectronServer = new ElectronIPCServer();

		// Resolve unique machine ID
		// logger.info('Resolving machine identifier...');
		// const machineId = await this.resolveMachineId();
		// logger.info(`Resolved machine identifier: ${machineId}`);

	}

	private async launchProcess(): Promise<void> {
		try {
			const sharedProcess = new SharedProcess();
			Logger.INSTANCE.info('SharedProcess is connecting!');
			await sharedProcess.connect();
			Logger.INSTANCE.info('SharedProcess connected!');

			// 进入登录UI
			new LoginBench().main()

			// BackServiceMain.INSTANCE.main()
		} catch (err) {
			Logger.INSTANCE.error('launchProcess uncaughtException:', err)
		}

		this.createTray()
	}

	private registerListeners(): void {

		Logger.INSTANCE.info('EntryMainProcess startup success!')

		process.on('uncaughtException', (err) => {
			Logger.INSTANCE.local('main uncaughtException:', err)
		})

		process.on('unhandledRejection', (reason, p) => {
			Logger.INSTANCE.local('main unhandledRejection:', reason, p)
		})

		// ipcMain.on('ondragstart', (event, filePath) => {
		// 	Logger.INSTANCE.info('ondragstart', filePath);
		// 	// event.sender.startDrag({
		// 	//   file: path.join(__dirname, filePath),
		// 	//   icon: iconName,
		// 	// })
		// })

		registerCommonEvent()
		registerCustomerEvent()
		registerTTcodeEvent()

		Logger.INSTANCE.info('ClientApplication registerListeners success!');
	}

	createTray() {
		app.whenReady().then(() => {
			const iconPath = fileFromPublicResource('public/static/app.ico')
			this.tray = new Tray(iconPath)
			const menu = Menu.buildFromTemplate([
				{
					label: '退出',
					click: () => {
						Logger.INSTANCE.info('Manual exit.')
						app.exit()
					}
				}
			])
			this.tray.setToolTip('client-tool')
			this.tray.setContextMenu(menu)
			this.tray.on('click', () => {
				let win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Sys_Dash_App)
				if (win) {
					win.show()
				} else {
					DashBench.INSTANCE.main()
				}
				Logger.INSTANCE.info('UI show', AppItemName.Sys_Dash_App);
			})
		})

	}

	public async relaunch() {

	}


}

export default ClientApplication
