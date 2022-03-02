import { ipcMain, app, dialog, globalShortcut, BrowserWindow } from 'electron'
import Logger from 'client/platform/environment/node/logger'
import ClientApplication from 'client/entry/electron_main/app'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import path = require('path')
import DashBench from 'client/workbench/main/dashBench/electron-main'

export default () => {

	ipcMain.on('client:relaunchClient', (event) => {
		Logger.INSTANCE.info('start-relaunch')
		ClientApplication.INSTANCE.relaunch()
		const win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Sys_Udt_App)
		if (win) {
			win.destroy()
			ClientApplication.INSTANCE.windowAppsMap.delete(AppItemName.Sys_Udt_App)
		}
	});

	ipcMain.on('client:setClosable', (event, bool: boolean) => {
		let win = BrowserWindow.fromWebContents(event.sender)
		win && win.setClosable(bool)
	})

	ipcMain.handle('client:getClientVersion', async (event, appName) => {
		return app.getVersion()
	})

	ipcMain.handle('client:getPath', async (event, pathName) => {
		const result = app.getPath(pathName)
		return result
	})

	ipcMain.handle('client:getAppDataDirPath', async (event, pathName) => {
		const result = app.getPath('appData')
		return path.join(result, '../')
	})

	ipcMain.on('client:toggleDevTools', event => event.sender.toggleDevTools());
	ipcMain.on('client:openDevTools', event => event.sender.openDevTools());

	ipcMain.on('client:reloadWindow', event => event.sender.reload());

	ipcMain.on('client:showMessageBox', async (event, opt) => {
		const win = BrowserWindow.fromWebContents(event.sender)
		if (win) {
			dialog.showMessageBox(win, opt)
		}

	});

	ipcMain.on('client:showErrorBox', async (event, title, content) => {
		dialog.showErrorBox(title, content)
	});

	ipcMain.on('client:showOpenDialog', async (event, seq, options) => {
		const url = await dialog.showOpenDialog(options)
		event.senderFrame.postMessage('client:protocal-response', {
			seq,
			data: url
		})
	});

	// GPU进程崩溃
	app.on('gpu-process-crashed', function () {
		Logger.INSTANCE.error('GPU进程崩溃，程序退出');
		app.exit(0);
	});

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
			let win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Sys_Dash_App)
			if (win) {
				win && win.show()
			} else {
				DashBench.INSTANCE.main()
			}

			Logger.INSTANCE.info('UI show', AppItemName.Sys_Dash_App);
		})
	}

}

