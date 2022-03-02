// import { IAppConfiguraiton, LocalAppConfList } from 'client/workbench/protocals/commonProtocal'
// import { deepClone } from 'client/base/common/objects';
import { AppServiceChannelCommand } from 'client/workbench/protocals/appServiceProtocal';
import { ipcRenderer } from 'electron';

class AppsService {
	public static readonly INSTANCE = new AppsService()
	// private appsConf: IAppConfiguraiton[] = [...LocalAppConfList]

	async main(): Promise<void> {
	}

	// get appsConfigurationList() {
	// 	return deepClone(this.appsConf)
	// }

	async handleTask(fromAppName: string, channelData: { channelCommand: string, reqData: any }) {
		switch (channelData.channelCommand) {
			case AppServiceChannelCommand.subCommand.getAppsConfigurationList:
				const appConf = await ipcRenderer.invoke('client:getAppConfList')
				return appConf
			default:
				break
		}
		return null
	}
}

export default AppsService
