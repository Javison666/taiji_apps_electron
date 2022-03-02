import path = require('path')
import ClientApplication from 'client/entry/electron_main/app'
import { fileFromClientResource, fileFromUserDataCommon } from 'client/base/common/network'
import { AppItemName, IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import Logger from 'client/platform/environment/node/logger'
import { hanleWindowRenderProtect } from 'client/workbench/utils/windowEnv'
import { env, EnvType } from 'client/env'
import Background from 'client/entry/electron_main/background'

const { BrowserWindow, app } = require('electron')

interface ICreateAppWindowParam {
	appName: AppItemName,
	loadURI: string,
	readyShow?: boolean,
	browserOpt?: Electron.BrowserWindowConstructorOptions
}

export default (param: ICreateAppWindowParam, appConf?: IAppConfiguraiton) => {
	let baseWebPreferences = {
		webSecurity: false,
		preload: path.join(__dirname, '../../base/parts/sandbox/electron_browser/preload.js'),
		additionalArguments: [`--client-window-config=${fileFromClientResource('').toString()}`, `--user-data-path=${fileFromUserDataCommon('').toString()}`, `--app-name=${param.appName}`, `--is-packaged=${Number(app.isPackaged)}`, `--env-${env}`],
		nodeIntegration: true,
		contextIsolation: false,
		nativeWindowOpen: true,
	}
	let browserWindowOpt = {
		show: false,
		// frame: false,
		webPreferences: baseWebPreferences
	}

	if (param.browserOpt) {
		browserWindowOpt = {
			...browserWindowOpt,
			...param.browserOpt,
			webPreferences: baseWebPreferences,
		}
	}
	// Logger.INSTANCE.info('browserWindowOpt', browserWindowOpt)

	const win = new BrowserWindow(browserWindowOpt)


	if (appConf && appConf.isBackground) {
		// 后台应用独立管理, 防止被一起关闭
		Background.INSTANCE.windowAppsMap.set(param.appName, win)
	} else {
		ClientApplication.INSTANCE.windowAppsMap.set(param.appName, win)
	}


	win.menuBarVisible = false
	if (env === EnvType.dev || process.argv.find(i => i.includes('debug')) || !app.isPackaged) {
		win.webContents.openDevTools();
	}

	win.webContents.on('unresponsive', () => {
		Logger.INSTANCE.error(param.appName, 'unresponsive.')
	})

	win.once('close', () => {
		Logger.INSTANCE.info(param.appName, 'close.')
		ClientApplication.INSTANCE.windowAppsMap.delete(param.appName)
	})

	win.webContents.on('did-finish-load', () => {
		Logger.INSTANCE.info(param.appName, 'did-finish-load.')
	})

	win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
		Logger.INSTANCE.info(param.appName, 'did-fail-load.', errorCode, errorDescription);
	});

	if (param.readyShow) {
		win.once('ready-to-show', () => {
			if (appConf && appConf.isBackground) {

			} else {
				win.show()
			}

		})
	}

	Logger.INSTANCE.info('load uri', param.appName, param.loadURI)

	if (param.loadURI.startsWith('http')) {
		win.loadURL(param.loadURI);
	} else {
		win.loadFile(param.loadURI);
	}

	if (appConf && appConf.appType !== IAppType.Public_Web) {
		hanleWindowRenderProtect(win, param.appName)
	}

	return {
		win
	}

}
