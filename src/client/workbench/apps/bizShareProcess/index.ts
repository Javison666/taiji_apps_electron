import { CommonChannelType, AppItemName } from 'client/workbench/protocals/commonProtocal'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'
import Logger from 'client/platform/environment/node/logger'
import AppsService from 'client/workbench/services/appsService'
import FileHistoryService from 'client/workbench/services/fileHistoryService'
import { AppServiceChannelCommand } from 'client/workbench/protocals/appServiceProtocal'
import { FileHistoryChannelCommand } from 'client/workbench/protocals/fileHistoryProtocal'



class BizShareProcess {
	public static INSTANCE = new BizShareProcess()

	async main(): Promise<void> {
		// 提供代理消息通道
		client.ipcMessagePort.registerHandlePortMessage(async (appName: string, data: any) => {
			const fromAppName = <AppItemName>appName
			try {
				const reqData = data.data
				switch (reqData.channelType) {
					case CommonChannelType._2p_getStaticServerPort:
						return StaticPageResourceServer.INSTANCE.port
					case AppServiceChannelCommand.mainCommand:
						return await AppsService.INSTANCE.handleTask(fromAppName, reqData)
					case FileHistoryChannelCommand.mainCommand:
						return await FileHistoryService.INSTANCE.handleTask(fromAppName, reqData)
					default:
						break
				}
			} catch (err) {
				Logger.INSTANCE.error('BizShareProcess.main', err)
			}
			Logger.INSTANCE.error('BizShareProcess.messageport not target', data)
			return null
		})
	}

}

export default BizShareProcess
