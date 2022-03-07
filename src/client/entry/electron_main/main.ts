import { app } from 'electron';
import Logger from 'client/platform/environment/node/logger'
import { ClientApplication } from './app'
import { byteSizeUnit } from 'client/workbench/utils/calc'
import os = require('os')
import path = require('path')
import fs = require('fs-extra')
import ini = require('ini')
import child_process = require('child_process');
import VersionUdtService, { isCurrentVersionPkg } from 'client/workbench/services/versionUdtService';
import { getVersionCommon, fileFromUserDataCommon } from 'client/base/common/network';

class EntryMainProcess {

	public static readonly INSTANCE = new EntryMainProcess();

	async main(): Promise<void> {
		try {
			Logger.INSTANCE.init('main')
			try {
				fs.mkdirp(fileFromUserDataCommon('./storage'))
				fs.mkdirp(path.join(process.cwd(), 'data/ttcode'))
			} catch (err) {
				Logger.INSTANCE.local('EntryMainProcess main:', err)
			}
			this.processHeart()
			this.startup()
			// await this.checkStartVersion()
		} catch (error) {
			Logger.INSTANCE.error('EntryMainProcess.main', error.message);
			app.exit(1);
		}
	}

	async processHeart() {
		const freeMemory = os.freemem()
		const totalMemory = os.totalmem()
		Logger.INSTANCE.info(`main process_heart: ${(100 - Math.floor(freeMemory / totalMemory * 100))}%, remain ${byteSizeUnit(freeMemory)} / ${byteSizeUnit(totalMemory)}`)
		setTimeout(() => {
			this.processHeart()
		}, 60000)
	}

	private async startup(): Promise<void> {
		await ClientApplication.INSTANCE.startup()
	}

	// 切换为版本号启动模式，因为目前稳定，所以暂时不启用
	public async checkStartVersion() {
		try {
			if (process.argv.find(i => i.includes('start-version'))) {
				this.startup()
				return
			}

			let curVersion = await getVersionCommon()
			const versionIniPath = path.join(VersionUdtService.INSTANCE.versionDir, './version.ini')
			if (
				!isCurrentVersionPkg &&
				fs.existsSync(versionIniPath)
			) {
				const iniData = ini.parse(fs.readFileSync(versionIniPath).toString())
				if (iniData.common && iniData.common.ver && iniData.common.ver !== curVersion) {
					let verExePath = `./${iniData.common.ver}/client-tool.exe`
					if (fs.existsSync(path.join(VersionUdtService.INSTANCE.versionDir, verExePath))) {
						let cmdStr = `cd ${path.join(VersionUdtService.INSTANCE.versionDir, `./${iniData.common.ver}`)} && start client-tool.exe ${process.argv.join(' ')}`
						Logger.INSTANCE.info('checkStartVersion cmd:', cmdStr)
						child_process.exec(cmdStr, { cwd: process.cwd() }, function (error: any, stdout: any, stderr: any) {
							Logger.INSTANCE.error('syncPddBat ink error: ', error)
							Logger.INSTANCE.info('syncPddBat ink stdout: ', stdout)
						})
						setTimeout(() => {
							app.exit()
						}, 3000)
						return
					}
				}
			}

		} catch (err) {
			Logger.INSTANCE.info(`main checkStartVersion err`, err)
		}

		this.startup()

	}


}

// Main Startup
EntryMainProcess.INSTANCE.main();
