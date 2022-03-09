import { BrowserWindow } from 'electron'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import ClientApplication from 'client/entry/electron_main/app'
import runApp from 'client/workbench/apps'
import { sleep } from 'client/common/time'
import { fileFromUserDataCommon } from 'client/base/common/network'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// 管理后台运行的apps
class Background {
	public static readonly INSTANCE = new Background()
	private _db: any = null

	private appNames: AppItemName[] = [AppItemName.Scan_Udt_App]

	public windowAppsMap: Map<AppItemName, BrowserWindow> = new Map()

	private _isRunning = false

	public launch() {
		if (Background.INSTANCE._isRunning) {
			return
		} else {
			Background.INSTANCE._isRunning = true
		}

		const dbPath = fileFromUserDataCommon('./backdata/storage/main.db')
		const adapter = new FileSync(dbPath)
		this._db = low(adapter)
		this._db.defaults({
			backgroundAppNames: [],
		}).write()

		this.syncFromLocal()
		Background.INSTANCE.run()
	}

	private syncFromLocal() {
		const appNames: AppItemName[] = Background.INSTANCE._db.get('backgroundAppNames')
			.value()
		Background.INSTANCE.appNames = appNames
	}

	public removeBackground(appName: AppItemName) {
		const appNames = Background.INSTANCE.appNames.filter(i => i !== appName)
		this._db.set('backgroundAppNames', appNames)
			.write()
		Background.INSTANCE.syncFromLocal()
		console.log(Background.INSTANCE.appNames)
	}

	public addAppName(appName: AppItemName) {
		if (Background.INSTANCE.appNames.includes(appName)) {
			return
		}
		this._db.get('backgroundAppNames')
			.push(appName)
			.write()
		Background.INSTANCE.syncFromLocal()
	}

	public getRunningAppNames() {
		let appNames: AppItemName[] = []
		Background.INSTANCE.windowAppsMap.forEach((win, appName) => {
			if (win) {
				appNames.push(appName)
			}
		})
		return appNames
	}

	private async run() {
		await sleep(1500)

		Background.INSTANCE.windowAppsMap.forEach((win, appName) => {
			if (win && Background.INSTANCE.appNames.indexOf(appName) === -1) {
				win.close()
				Background.INSTANCE.windowAppsMap.delete(appName)
			}
		})

		for (let appName of Background.INSTANCE.appNames) {
			let win = Background.INSTANCE.windowAppsMap.get(appName)
			if (win) {
				continue
			} else {
				const appConf = ClientApplication.INSTANCE.appList.find(i => i.appName === appName)
				if (appConf) {
					await runApp(Object.assign({}, appConf, {
						isBackground: true
					}))
					await sleep(200)
				}
			}
		}

		Background.INSTANCE.run()
	}
}

export default Background
