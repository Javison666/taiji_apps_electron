import { app } from 'electron';
import Logger from 'client/platform/environment/node/logger'
import { ClientApplication } from './app'
import { byteSizeUnit } from 'client/workbench/utils/calc'
import os = require('os')
import fs = require('fs-extra')
import { fileFromUserDataCommon } from 'client/base/common/network';

class EntryMainProcess {

	public static readonly INSTANCE = new EntryMainProcess();

	async main(): Promise<void> {
		try {
			Logger.INSTANCE.init('main')
			try {
				fs.mkdirpSync(fileFromUserDataCommon('./backdata/storage'))
				fs.mkdirpSync(fileFromUserDataCommon('./backdata/ttcode'))
			} catch (err) {
				Logger.INSTANCE.local('EntryMainProcess main:', err)
			}
			this.processHeart()
			this.startup()
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

}

// Main Startup
EntryMainProcess.INSTANCE.main();
