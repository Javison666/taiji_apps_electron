import Logger from 'client/platform/environment/node/logger'
import TTCodeService, { ITaskConf } from 'client/workbench/apps/ttcode/lib/TTcodeService'
import qs = require('qs')

class TTcodeApp {
	public static readonly INSTANCE = new TTcodeApp()

	async main(): Promise<void> {
		try {
			this.startup()
		} catch (err) {
			Logger.INSTANCE.error('TTcodeApp.main', err)
		}
	}

	private async startup(): Promise<void> {
		try {
			const query = qs.parse(location.search.substr(1))
			let title = query.taskTitle
			Logger.INSTANCE.info('TTcodeApp start:', title)
			if (title) {
				const conf = <ITaskConf>await client.ipcRenderer.invoke('client:getTTcodeTaskByName', title)
				Logger.INSTANCE.info('TTcodeApp conf:', conf)
				conf && TTCodeService.INSTANCE.runTaskConfSync(conf)
			}
			Logger.INSTANCE.info('TTcodeApp finished:', title)
		} catch (err) {
			Logger.INSTANCE.error('TTcodeApp startup error:', err)
		}
		client.app.destroyWindow()
	}

}

export default TTcodeApp
