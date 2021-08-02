import { AppItemName, IAppConfiguraiton, IAppType } from 'client/workbench/apps/appsEnum'

import ShareWebApp from 'client/workbench/apps/shareWeb'
import SprotectApp from 'client/workbench/apps/sprotect'

export const runApp = (appConfiguaration: IAppConfiguraiton) => {
	if (appConfiguaration.appType === IAppType.Share_Web) {
		new ShareWebApp().main(appConfiguaration)
		return
	}
	switch (appConfiguaration.appName) {
		case AppItemName.Sprotect:
			new SprotectApp().main()
			break
		default:
			break
	}
}

export default runApp
