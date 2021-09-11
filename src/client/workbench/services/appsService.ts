import { IAppConfiguraiton, LocalAppConfList } from 'client/workbench/protocals/commonProtocal'
import { deepClone } from 'client/base/common/objects';
import { AppServiceChannelCommand } from 'client/workbench/protocals/appServiceProtocal';

class AppsService {
	public static readonly INSTANCE = new AppsService()
	private appsConf: IAppConfiguraiton[] = [...LocalAppConfList]

	async main(): Promise<void> {
		await this.udtConf()
	}

	async udtConf() {

	}

	get appsConfigurationList() {
		return deepClone(this.appsConf)
	}

	async handleTask(fromAppName: string, channelData: { channelCommand: string, reqData: any }) {
		switch (channelData.channelCommand) {
			case AppServiceChannelCommand.subCommand.getAppsConfigurationList:
				return this.appsConf
			default:
				break
		}
		return null
	}
}

export default AppsService
