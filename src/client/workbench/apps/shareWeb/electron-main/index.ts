import Logger from 'client/platform/environment/node/logger'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import { IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import createAppWindow from 'client/workbench/utils/createAppWindow'

class ShareWebApp {
	async main(shareWebAppConf: IAppConfiguraiton): Promise<void> {
		try {
			if (shareWebAppConf.appType === IAppType.Share_Web || shareWebAppConf.appType === IAppType.Public_Web) {
				await this.startup(shareWebAppConf);
			}
		} catch (error) {
			Logger.INSTANCE.error('ShareWebApp main', error.message);
		}
	}

	private async startup(shareWebAppConf: IAppConfiguraiton): Promise<void> {
		Logger.INSTANCE.info(`share-web-app ${shareWebAppConf.appName} startup success!`)
		createAppWindow({
			appName: shareWebAppConf.appName,
			loadURI: StaticPageResourceServer.INSTANCE.getAppNameServerAddr(shareWebAppConf),
			browserOpt: shareWebAppConf.browserOpt,
			readyShow: true
		}, shareWebAppConf)
	}

}

export default ShareWebApp
