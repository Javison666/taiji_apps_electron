import { AppItemName, IAppConfiguraiton } from 'client/workbench/apps/appsEnum'

import SprotectApp from 'client/workbench/apps/sprotect'

export const runApp = (appConfiguaration: IAppConfiguraiton) => {
	switch (appConfiguaration.app_name) {
		case AppItemName.Sprotect:
			new SprotectApp().main()
			break
		default:
			break
	}
}

export default runApp
