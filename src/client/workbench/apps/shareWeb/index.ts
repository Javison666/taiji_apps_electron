import logger from 'client/common/log'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import { fileFromClientResource } from 'client/base/common/network'
import { IAppConfiguraiton, IAppType } from 'client/workbench/apps/appsEnum'

const { BrowserWindow } = require('electron')
// const shareWebAppConf = {
// 	appName: 'testweb',
// 	startWidth: 1024,
// 	startHeight: 720
// }

class ShareWebApp {
	async main(shareWebAppConf: IAppConfiguraiton): Promise<void> {
		try {
			if (shareWebAppConf.appType === IAppType.Share_Web) {
				await this.startup(shareWebAppConf);
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(shareWebAppConf: IAppConfiguraiton): Promise<void> {
		logger.info(`share-web-app ${shareWebAppConf.appName} startup success!`)
		const win = new BrowserWindow({
			show: false,
			width: shareWebAppConf.startWidth,
			height: shareWebAppConf.startHeight,
			webPreferences: {
				webSecurity: false,
				preload: fileFromClientResource('client/base/parts/sandbox/electron_browser/preload.js'),
				additionalArguments: [`--client-window-config=${fileFromClientResource('').toString()}`, `--app-name=${shareWebAppConf.appName}`],
				nodeIntegration: true,
				contextIsolation: false,
				nativeWindowOpen: true,
			}
		})
		win.menuBarVisible = false
		win.once('ready-to-show', () => {
			win.show()
		})
		win.loadURL(StaticPageResourceServer.INSTANCE.getAppNameServerAddr(shareWebAppConf.appName))
		win.webContents.openDevTools();
	}

}

export default ShareWebApp
