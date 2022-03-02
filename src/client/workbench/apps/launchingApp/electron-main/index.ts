import { fileFromClientResource } from 'client/base/common/network';
import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal';
import { hanleWindowRenderProtect } from 'client/workbench/utils/windowEnv';
import { BrowserWindow } from 'electron'

class LaunchingMain {

	public static readonly INSTANCE = new LaunchingMain()

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		Logger.INSTANCE.info(`BackService startup success!`)
		await this.createWindow()
	}

	private async createWindow() {
		const win = new BrowserWindow({
			show: false,
			frame: false,
			webPreferences: {
				webSecurity: false,
				nodeIntegration: true,
				contextIsolation: false,
				nativeWindowOpen: true,
			}
		})

		win.once('ready-to-show', () => {
			win.show()
		})
		win.loadURL(fileFromClientResource('client/workbench/apps/launchingApp/electron-main/index.html'));

		hanleWindowRenderProtect(win, AppItemName.Launching_App)

	}

}

export default LaunchingMain
