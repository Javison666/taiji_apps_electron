import logger from 'client/common/log'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import { AppItemName } from 'client/workbench/apps/appsEnum'
const { BrowserWindow } = require('electron')

class SprotectApp {
	main(): void {
		try {
			this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		logger.info('sprotect-app startup success!')
		const win = new BrowserWindow({ show: false })
		win.once('ready-to-show', () => {
			// win.show()
		})
		win.loadURL(StaticPageResourceServer.INSTANCE.getAppNameServerAddr(AppItemName.Sprotect))
	}

}

export default SprotectApp
