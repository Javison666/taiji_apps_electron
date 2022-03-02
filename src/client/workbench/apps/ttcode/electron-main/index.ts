import Logger from 'client/platform/environment/node/logger'
import { fileFromClientResource, fileFromUserDataCommon } from 'client/base/common/network'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import TTCodeService, { ITaskConf } from 'client/workbench/apps/ttcode/lib/TTcodeService'
import path = require('path')
import fs = require('fs')
import { env, EnvType } from 'client/env'
import { app, BrowserWindow } from 'electron'

export interface ITTWinMap {
	conf: ITaskConf,
	win: BrowserWindow
}

export const TTcodeTaskMap: Map<string, ITTWinMap> = new Map()

class TTcode {

	public static readonly INSTANCE = new TTcode()
	public readonly dataPath = path.join(process.cwd(), './data/ttcode')

	async main(ttcodeTaskConf: ITaskConf): Promise<void> {
		try {
			if (TTcodeTaskMap.get(ttcodeTaskConf.name)) {
				Logger.INSTANCE.info(`TTcode ttcodeTaskConf is existed!`)
				return
			}

			Logger.INSTANCE.info(`TTcode startup success!`)
			await this.createWindow(ttcodeTaskConf)
		} catch (error) {
			console.error(error.message);
		}
	}

	public getTTWinItem(name: string) {
		return TTcodeTaskMap.get(name)
	}

	public clearTTWinItem(name: string) {
		return TTcodeTaskMap.delete(name)
	}

	public getTTcodeTask(name: string) {
		return TTCodeService.INSTANCE.decodeTTFileSync(path.join(TTcode.INSTANCE.dataPath, `${name}.tt`))
	}

	public isTTcodeTaskFileExisted(name: string) {
		let isExisted = true
		try {
			fs.accessSync(path.join(TTcode.INSTANCE.dataPath, `${name}.tt`), fs.constants.F_OK)
		} catch (err) {
			Logger.INSTANCE.info('isTTcodeTaskFileExisted err:', err)
			isExisted = false
		}
		return isExisted
	}

	public getTTcodeAppList() {
		const list = fs.readdirSync(TTcode.INSTANCE.dataPath)
		Logger.INSTANCE.info('getTTcodeAppList', list)
		return list.filter(i => i.endsWith('.tt')).map(i => i.substr(0, i.length - 3))
	}

	public saveLowcodeApp(ttcodeTaskConf: ITaskConf) {
		const name = ttcodeTaskConf.name
		TTCodeService.INSTANCE.encodeTTFileSync(ttcodeTaskConf, path.join(TTcode.INSTANCE.dataPath, `${name}.tt`))
	}

	private async createWindow(ttcodeTaskConf: ITaskConf) {
		const loadURI = fileFromClientResource(`client/workbench/apps/ttcode/electron-main/index.html?taskTitle=${ttcodeTaskConf.name}`)
		let browserWindowOpt = {
			show: false,
			webPreferences: {
				webSecurity: false,
				preload: path.join(__dirname, '../../../../base/parts/sandbox/electron_browser/preload.js'),
				additionalArguments: [`--client-window-config=${fileFromClientResource('').toString()}`, `--user-data-path=${fileFromUserDataCommon('').toString()}`, `--app-name=${AppItemName.TTcode_App}`, `--is-packaged=${Number(app.isPackaged)}`, `--env-${env}`],
				nodeIntegration: true,
				contextIsolation: false,
				nativeWindowOpen: true,
			}
		}

		const win = new BrowserWindow(browserWindowOpt)

		TTcodeTaskMap.set(ttcodeTaskConf.name, {
			conf: ttcodeTaskConf,
			win
		})

		const closeTask = (ttcodeTaskName: string) => {
			win.destroy()
			TTcode.INSTANCE.clearTTWinItem(ttcodeTaskName)
		}

		win.menuBarVisible = false
		if (env === EnvType.dev || process.argv.find(i => i.includes('debug')) || !app.isPackaged) {
			Logger.INSTANCE.info('tt openDevTools')
			win.webContents.openDevTools();
		}

		win.webContents.on('unresponsive', () => {
			Logger.INSTANCE.error(AppItemName.TTcode_App, 'unresponsive.')
		})

		win.webContents.on('did-finish-load', () => {
			Logger.INSTANCE.info(AppItemName.TTcode_App, 'did-finish-load.')
		})

		win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
			Logger.INSTANCE.error(AppItemName.TTcode_App, 'did-fail-load.', errorCode, errorDescription);
			closeTask(ttcodeTaskConf.name)
		});

		win.on('closed', () => {
			Logger.INSTANCE.info(AppItemName.TTcode_App, 'closed.');
			closeTask(ttcodeTaskConf.name)
		});


		Logger.INSTANCE.info('load uri', AppItemName.TTcode_App, loadURI)
		win.loadURL(loadURI);

		// win.loadURL('http://127.0.0.1:5000/page/apps/sys_dash_app/index.html');

	}

}

export default TTcode
