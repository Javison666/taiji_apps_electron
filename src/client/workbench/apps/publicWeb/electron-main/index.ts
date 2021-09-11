import Logger from 'client/platform/environment/node/logger'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import { IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import createAppWindow from 'client/workbench/utils/createAppWindow'

class PublicWebApp {
	async main(publicWebAppConf: IAppConfiguraiton): Promise<void> {
		try {
			if (publicWebAppConf.appType === IAppType.Share_Web || publicWebAppConf.appType === IAppType.Public_Web) {
				await this.startup(publicWebAppConf);
			}
		} catch (error) {
			Logger.INSTANCE.error('PublicWebApp main', error.message);
		}
	}

	private async startup(publicWebAppConf: IAppConfiguraiton): Promise<void> {
		Logger.INSTANCE.info(`public-web-app ${publicWebAppConf.appName} startup success!`)
		createAppWindow({
			appName: publicWebAppConf.appName,
			loadURI: StaticPageResourceServer.INSTANCE.getAppNameServerAddr(publicWebAppConf),
			browserOpt: publicWebAppConf.browserOpt,
			readyShow: true
		}, publicWebAppConf)
	}

}

export default PublicWebApp
