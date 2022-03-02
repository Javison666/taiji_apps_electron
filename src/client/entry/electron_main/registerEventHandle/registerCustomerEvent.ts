import { ipcMain, MessageChannelMain, session, dialog, Menu, BrowserWindow } from 'electron'
import Logger from 'client/platform/environment/node/logger'
import ClientApplication from 'client/entry/electron_main/app'
import { AppItemName, IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import { runApp } from 'client/workbench/apps/index'
import path = require('path')
import Background from 'client/entry/electron_main/background'
import { ITaskConf } from 'client/workbench/apps/ttcode/lib/TTcodeService'
import TTcode from 'client/workbench/apps/ttcode/electron-main'

type urlStr = string
type downloadProcess = Number

const downloadCb: {
	[propertyNames: string]: {
		item?: Electron.DownloadItem,
		cb: (...params: any) => void
	}
} = {}
const backServiceDownloadProcessMap: Map<urlStr, downloadProcess> = new Map()

export function handleDownload(appName: AppItemName, url: string) {
	return new Promise(resolve => {
		try {
			let win
			win = ClientApplication.INSTANCE.windowAppsMap.get(appName)
			Logger.INSTANCE.info('downloadURL find win', appName)
			if (win) {
				downloadCb[url] = {
					cb: (filePath) => {
						resolve(filePath)
					}
				}
				Logger.INSTANCE.info('downloadURL start', url)
				win.webContents.downloadURL(url)
			} else {
				resolve(null)
			}
		} catch (err) {
			Logger.INSTANCE.error('handleDownloadErr', err)
			resolve(null)
		}
	})
}


export default () => {

	ipcMain.on('client:cancelDownloadItem', async (event, url: string) => {
		Logger.INSTANCE.info('client:cancelDownloadItem', url);
		if (downloadCb[url] && downloadCb[url].item) {
			downloadCb[url].item?.cancel()
			Logger.INSTANCE.info('client:cancelDownloadItem success', url);
		}
	});

	ipcMain.handle('client:getAppConfList', async () => {
		return ClientApplication.INSTANCE.appList
	});

	ipcMain.handle('client:getBackgroundAppNamesList', async () => {
		return Background.INSTANCE.getRunningAppNames()
	});

	ipcMain.handle('client:launchApp', async (event, appConf: IAppConfiguraiton) => {
		const targetWindow = ClientApplication.INSTANCE.windowAppsMap.get(appConf.appName)
		if (targetWindow) {
			targetWindow.show()
		} else {
			Logger.INSTANCE.info('launchApp', appConf.appName);
			return runApp(appConf)
		}
	})

	ipcMain.on('client:hideWindow', async (event, appName: AppItemName) => {
		Logger.INSTANCE.info('UI hide', appName);
		const win = ClientApplication.INSTANCE.windowAppsMap.get(appName)
		win && win.hide()
	});

	ipcMain.on('client:destroyWindow', async (event, appName: AppItemName) => {
		if (appName) {
			Logger.INSTANCE.info('UI close', appName);
			const win = ClientApplication.INSTANCE.windowAppsMap.get(appName)
			win && win.destroy()
			ClientApplication.INSTANCE.windowAppsMap.delete(appName)
		} else {
			const win = BrowserWindow.fromWebContents(event.sender)
			win?.destroy()
		}
	});

	ipcMain.on('client:udtClientSuccess', async (event) => {
		let win = ClientApplication.INSTANCE.windowAppsMap.get(AppItemName.Sys_Udt_App)
		if (win) {
			win && win.show()
			win.webContents.executeJavaScript('console.log("udtClientSuccess");client.bridge.call({cmd:"udtClientSuccess"})')
		}
	})

	ipcMain.on('client:showAppNameContextMenu', (event, appName: AppItemName, command: string, labelList: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]) => {
		let win = BrowserWindow.fromWebContents(event.sender)
		if (win) {
			labelList.forEach(lable => {
				if (lable.id) {
					lable.click = () => { event.sender.send(command, appName, lable.id) }
				}
			})
			const menu = Menu.buildFromTemplate(labelList)
			menu.popup({
				window: win
			})
		}
	})

	ipcMain.on('proxy-apps-channel-request', (event, targetAppName: AppItemName, fromAppName: AppItemName) => {
		// For security reasons, let's make sure only the frames we expect can
		// access the worker.
		const targetWindow = ClientApplication.INSTANCE.windowAppsMap.get(targetAppName)
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


	ipcMain.handle('client:downloadFile', async (event, appName, url) => {
		const result = await handleDownload(appName, url)
		downloadCb[url] && delete downloadCb[url]
		return result
	})

	ipcMain.handle('client:showHandleWindow', async (event, message) => {
		const idx = await dialog.showMessageBox({
			title: '操作',
			message: message,//信息提示框内容
			buttons: ['取消', '确认'],//下方显示的按钮
			noLink: true, //win下的样式
			type: 'info',//图标类型
			cancelId: 0//点击x号关闭返回值
		})
		if (idx.response === 1) {
			return true
		} else {
			return false
		}
	});


	ipcMain.handle('client:addBackground', (event, appName: AppItemName,) => {
		Background.INSTANCE.addAppName(appName)
		return
	})

	ipcMain.handle('client:removeBackground', (event, appName: AppItemName,) => {
		Background.INSTANCE.removeBackground(appName)
		return
	})

	ipcMain.handle('client:showUdtWindow', async (event, ver: string, url: string) => {
		backServiceDownloadProcessMap.set(url, 0)
		runApp({
			appName: AppItemName.Sys_Udt_App,
			appNick: '版本更新',
			querys: `?version=${ver}&url=${url}`,
			appType: IAppType.Share_Web,
			browserOpt: {
				width: 400,
				height: 200,
			}
		})
	})

	ipcMain.handle('client:getBackServiceDownloadProcess', async (event, url: string) => {
		Logger.INSTANCE.info('getBackServiceDownloadProcess', url, backServiceDownloadProcessMap.get(url))
		const process = backServiceDownloadProcessMap.get(url)
		if (!process) {
			return 0
		}
		return process
	})

	session.defaultSession.on('will-download', (event, item) => {
		Logger.INSTANCE.info('will-download', decodeURIComponent(item.getURL()))
		if (downloadCb[decodeURIComponent(item.getURL())]) {
			downloadCb[decodeURIComponent(item.getURL())].item = item
		}
		item.setSavePath(path.join(process.cwd(), 'cache', item.getFilename()))
		item.on('updated', (event, state) => {
			if (state === 'progressing') {
				if (item.isPaused()) {
					Logger.INSTANCE.info('Download info', decodeURIComponent(item.getURL()), 'isPaused', state)
				} else {
					let processNum = item.getReceivedBytes() / item.getTotalBytes()
					Logger.INSTANCE.info('backServiceDownloadProcessMap.set', decodeURIComponent(item.getURL()))
					backServiceDownloadProcessMap.set(decodeURIComponent(item.getURL()), processNum)
					Logger.INSTANCE.info('Download info', decodeURIComponent(item.getURL()), state, (processNum * 100).toFixed(2) + '%')
				}
			}
			if (state === 'interrupted') {
				backServiceDownloadProcessMap.set(decodeURIComponent(item.getURL()), -1)
				Logger.INSTANCE.error('Download info', item.getURL(), state)
			}
		})
		item.once('done', (event, state) => {
			if (state === 'completed') {
				backServiceDownloadProcessMap.set(decodeURIComponent(item.getURL()), 100)
				Logger.INSTANCE.info('Download success', decodeURIComponent(item.getURL()), item.getSavePath(), state)
				downloadCb[decodeURIComponent(item.getURL())].cb(item.getSavePath())

			} else {
				Logger.INSTANCE.error('Download failed', item.getURL(), state)
				backServiceDownloadProcessMap.set(decodeURIComponent(item.getURL()), -1)
				downloadCb[decodeURIComponent(item.getURL())].cb(false)
			}
		})
	})


	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [
					'default-src \'self\' http://127.0.0.1:* http://*.tpddns.cn:* https://*.tpddns.cn:* https://*.jiweiqing.cn https://*.dingtalk.com wss://*.jiweiqing.cn ws://127.0.0.1:* ws://localhost:* https://at.alicdn.com \'unsafe-inline\' \'unsafe-eval\' data:',
				]
			}
		})
	})

	// ttcode模块
	ipcMain.handle('client:runTTcodeTaskByName', async (event, name: string) => {
		const ttcodeTaskConf = TTcode.INSTANCE.getTTcodeTask(name)
		await TTcode.INSTANCE.main(ttcodeTaskConf)
		return
	})

	ipcMain.handle('client:getTTcodeAppList', async () => {
		return TTcode.INSTANCE.getTTcodeAppList()
	})


	ipcMain.handle('client:getTTcodeTask', async (event, name: string) => {
		return TTcode.INSTANCE.getTTcodeTask(name)
	})

	ipcMain.handle('client:stopTTcodeTask', async (event, name: string) => {
		let winItem = TTcode.INSTANCE.getTTWinItem(name)
		if (winItem) {
			winItem.win.destroy()
			TTcode.INSTANCE.clearTTWinItem(name)
		}
		return
	})

	ipcMain.handle('client:isTTcodeTaskFileExisted', async (event, name) => {
		return TTcode.INSTANCE.isTTcodeTaskFileExisted(name)
	})

	ipcMain.handle('client:saveLowcodeApp', async (event, ttcodeTaskConf: ITaskConf) => {
		TTcode.INSTANCE.saveLowcodeApp(ttcodeTaskConf)
		return
	})
}

