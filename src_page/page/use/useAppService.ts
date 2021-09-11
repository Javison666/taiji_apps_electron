import { launchAppB } from '../bridge/appServiceBridge'
import { IAppConfiguraiton } from "src/client/workbench/protocals/commonProtocal";

export default () => {


	const useLaunchApp = async (appConf: IAppConfiguraiton) => {
		launchAppB(appConf)
	}

	return {
		useLaunchApp
	}
}
