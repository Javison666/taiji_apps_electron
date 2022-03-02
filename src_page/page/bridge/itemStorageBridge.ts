import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import { ItemStorageChannelCommand, IItemStorageReqSetItem, IItemStorageReqGetItem } from 'src/client/workbench/protocals/itemStorageProtocal'

export const setAppStorage = async (reqData: IItemStorageReqSetItem) => {
	return client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
		channelType: ItemStorageChannelCommand.mainCommand,
		channelCommand: ItemStorageChannelCommand.subCommand.setItem,
		reqData
	})
}

export const getAppStorage = async (reqData: IItemStorageReqGetItem) => {
	return client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
		channelType: ItemStorageChannelCommand.mainCommand,
		channelCommand: ItemStorageChannelCommand.subCommand.getItemContent,
		reqData
	})
}
