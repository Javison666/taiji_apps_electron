import logger from 'client/common/log'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import { AppItemName } from 'client/workbench/apps/appsEnum'
import { fileFromClientResource } from 'client/base/common/network'
const { BrowserWindow } = require('electron')

class SprotectApp {
	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		logger.info('sprotect-app startup success!')
		const win = new BrowserWindow({
			show: false,
			webPreferences: {
				preload: fileFromClientResource('client/base/parts/sandbox/electron_browser/preload.js'),
				additionalArguments: [`--client-window-config=${fileFromClientResource('').toString()}`],
				nodeIntegration: true,
				contextIsolation: false,
				nativeWindowOpen: true,
			}
		})
		win.once('ready-to-show', () => {
			win.show()
		})
		win.loadURL(StaticPageResourceServer.INSTANCE.getAppNameServerAddr(AppItemName.Sprotect))
		win.webContents.openDevTools();
	}

}

export default SprotectApp
