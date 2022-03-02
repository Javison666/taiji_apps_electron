import { IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'

import ShareWebApp from 'client/workbench/apps/shareWeb/electron-main/index'
import PublicWebApp from 'client/workbench/apps/publicWeb/electron-main/index'
import Logger from 'client/platform/environment/node/logger'

export const runApp = async (appConfiguaration: IAppConfiguraiton) => {
	Logger.INSTANCE.info('runApp', appConfiguaration)
	switch (appConfiguaration.appType) {
		case IAppType.Share_Web:
			new ShareWebApp().main(appConfiguaration)
			break
		case IAppType.Public_Web:
			switch (appConfiguaration.appName) {
				default:
					new PublicWebApp().main(appConfiguaration)
					break
			}
			break
		case IAppType.Client_Web:
			
			break
		default:
			break;
	}

}

export default runApp
