import { ipcMain, MessageChannelMain, BrowserWindow, app, dialog, Menu, Tray, globalShortcut, session } from 'electron'
import { onUnexpectedError } from 'client/base/common/errors'
import Logger from 'client/platform/environment/node/logger'
import { AppItemName, IAppConfiguraiton } from 'client/workbench/protocals/commonProtocal'
import { runApp } from 'client/workbench/apps/index'
import { SharedProcess } from 'client/platform/sharedProcess/electron-main/sharedProcess'
import LoginBench from 'client/workbench/main/loginBench/electron-main/index'
import { fileFromPublicResource } from 'client/base/common/network'
import path = require('path')
import BackServiceMain from 'client/workbench/apps/backService/electron-main/index'
import DashBench from 'client/workbench/main/dashBench/electron-main'

/**
 * The main client application. There will only ever be one instance,
 * even if the user starts many instances (e.g. from the command line).
 */
export class ClientApplication {

	public static readonly INSTANCE = new ClientApplication();
	public windowAppsMap: Map<AppItemName, BrowserWindow> = new Map()
	public tray: Tray | null = null;

	private downloadCb: { [propertyNames: string]: (...params: any) => void } = {}

	public clientData = {
		staticServerPort: 0
	};

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
		this.createTray()
		const sharedProcess = new SharedProcess();

		Logger.INSTANCE.info('SharedProcess start connect!');
		await sharedProcess.connect();
		Logger.INSTANCE.info('SharedProcess connect success!');

		// 进入登录UI
		new LoginBench().main()

		BackServiceMain.INSTANCE.main()
	}

	private registerListeners(): void {

		process.on('uncaughtException', (err) => {
			Logger.INSTANCE.error('main uncaughtException:', err)
		})

		process.on('unhandledRejection', (reason, p) => {
			Logger.INSTANCE.error('main unhandledRejection:', reason, p)
		})

		Logger.INSTANCE.info('EntryMainProcess startup success!')
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					'Content-Security-Policy': [
						'default-src \'self\' http://127.0.0.1:* https://*.weierai.com wss://*.weierai.com ws://127.0.0.1:* https://at.alicdn.com \'unsafe-inline\' \'unsafe-eval\' data:',
					]
				}
			})
		})

		session.defaultSession.on('will-download', (event, item) => {
			Logger.INSTANCE.info('will-download', decodeURIComponent(item.getURL()))
			item.setSavePath(path.join(process.cwd(), 'cache', item.getFilename()))
			item.on('updated', (event, state) => {
				if (state === 'progressing') {
					if (item.isPaused()) {
						Logger.INSTANCE.info('Download info', decodeURIComponent(item.getURL()), 'isPaused', state)
					} else {
						Logger.INSTANCE.info('Download info', decodeURIComponent(item.getURL()), state, (item.getReceivedBytes() / item.getTotalBytes() * 100).toFixed(2) + '%')
					}
				}
				if (state === 'interrupted') {
					Logger.INSTANCE.error('Download info', item.getURL(), state)
				}
			})
			item.once('done', (event, state) => {
				if (state === 'completed') {
					Logger.INSTANCE.info('Download success', decodeURIComponent(item.getURL()), item.getSavePath(), state)
					this.downloadCb[decodeURIComponent(item.getURL())](item.getSavePath())

				} else {
					Logger.INSTANCE.error('Download failed', item.getURL(), state)
					this.downloadCb[decodeURIComponent(item.getURL())](false)
				}
			})
		})


		ipcMain.handle('client:getPath', async (event, pathName) => {
			const result = app.getPath(pathName)
			return result
		})

		ipcMain.handle('client:getAppDataDirPath', async (event, pathName) => {
			const result = app.getPath('appData')
			return path.join(result, '../')
		})

		ipcMain.handle('client:launchApp', async (event, appConf: IAppConfiguraiton) => {
			const targetWindow = this.windowAppsMap.get(appConf.appName)
			if (targetWindow) {
				targetWindow.show()
			} else {
				Logger.INSTANCE.info('launchApp', appConf.appName);
				return runApp(appConf)
			}
		})

		process.on('uncaughtException', err => this.onUnexpectedError(err));
		process.on('unhandledRejection', (reason: unknown) => onUnexpectedError(reason));

		ipcMain.on('client:toggleDevTools', event => event.sender.toggleDevTools());
		ipcMain.on('client:openDevTools', event => event.sender.openDevTools());



		ipcMain.on('client:reloadWindow', event => event.sender.reload());

		ipcMain.on('client:showOpenDialog', async (event, seq, options) => {
			const url = await dialog.showOpenDialog(options)
			event.senderFrame.postMessage('client:protocal-response', {
				seq,
				data: url
			})
		});

		ipcMain.on('client:hideWindow', async (event, appName) => {
			Logger.INSTANCE.info('UI hide', appName);
			const win = this.windowAppsMap.get(appName)
			win && win.hide()
		});

		ipcMain.on('proxy-apps-channel-request', (event, targetAppName: AppItemName, fromAppName: AppItemName) => {
			// For security reasons, let's make sure only the frames we expect can
			// access the worker.
			const targetWindow = this.windowAppsMap.get(targetAppName)
			if (targetWindow) {
				// Create a new channel ...
				const { port1, port2 } = new MessageChannelMain()
				// ... send one end to the worker ...
				targetWindow.webContents.postMessage('provide-apps-channel-event', fromAppName, [port1])
				// ... and the other end to the main window.
				event.senderFrame.postMessage('proxy-apps-channel-event', targetAppName, [port2])
				// Now the main window and the worker can communicate with each other
				// without going through the main process!
			} else {
				event.senderFrame.postMessage(`proxy-apps-channel-${targetAppName}-error`, null)
			}
		})

		app.whenReady().then(() => {
			// Register a 'CommandOrControl+X' shortcut listener.
			globalShortcut.register('CommandOrControl+F12', () => {
				// win && win.webContents.openDevTools()
			})
			globalShortcut.register('CommandOrControl+Alt+F12', () => {
				ClientApplication.INSTANCE.windowAppsMap.forEach(win => {
					win && win.webContents.openDevTools()
				})
			})
		})


		// 防止两次启动程序
		const gotTheLock = app.requestSingleInstanceLock();
		if (!gotTheLock) {
			Logger.INSTANCE.info('Second Instance exit!');
			app.exit();
		} else {
			app.on('second-instance', () => {
				Logger.INSTANCE.info('Second Instance Launch!');
				// Someone tried to run a second instance, we should focus our window.
				let win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Dash_App)
				win && win.show()
				Logger.INSTANCE.info('UI show', AppItemName.Dash_App);
			})
		}

		// GPU进程崩溃
		app.on('gpu-process-crashed', function () {
			Logger.INSTANCE.error('GPU进程崩溃，程序退出');
			app.exit(0);
		});

		ipcMain.handle('client:downloadFile', async (event, appName, url) => {
			const result = await this.handleDownload(appName, url)
			return result
		})

		// ipcMain.on('ondragstart', (event, filePath) => {
		// 	Logger.INSTANCE.info('ondragstart', filePath);
		// 	// event.sender.startDrag({
		// 	//   file: path.join(__dirname, filePath),
		// 	//   icon: iconName,
		// 	// })
		// })


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
				let win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Dash_App)
				if (win) {
					win.show()
				} else {
					DashBench.INSTANCE.main()
				}
				Logger.INSTANCE.info('UI show', AppItemName.Dash_App);
			})
		})

	}

	private onUnexpectedError(err: Error): void {
		// if (err) {

		// 	// take only the message and stack property
		// 	const friendlyError = {
		// 		message: `[uncaught exception in main]: ${err.message}`,
		// 		stack: err.stack
		// 	};

		// 	// handle on client side
		// 	this.windowsMainService?.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
		// }

		Logger.INSTANCE.error(`[uncaught exception in main]: ${err}`);
		if (err.stack) {
			Logger.INSTANCE.error(err.stack);
		}
	}

	handleDownload(appName: AppItemName, url: string) {
		return new Promise(resolve => {
			try {
				const win = this.windowAppsMap.get(appName)
				Logger.INSTANCE.info('downloadURL find win', appName)
				if (win) {
					this.downloadCb[url] = (filePath) => {
						resolve(filePath)
					}
					Logger.INSTANCE.info('downloadURL start', url)
					win.webContents.downloadURL(url)
				} else {
					resolve(null)
				}
			} catch (err) {
				Logger.INSTANCE.error('handleDownload', err)
				resolve(null)
			}
		})
	}
}

export default ClientApplication
