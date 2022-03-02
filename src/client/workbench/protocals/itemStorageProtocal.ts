import { AppItemName } from "./commonProtocal";

export const ItemStorageChannelCommand = {
	mainCommand: 'itemStorage',
	subCommand: {
		setItem: 'setItem',
		getItem: 'getItem',
		getItemContent: 'getItemContent'
	}
}

export enum IItemStorageItemType {
	notifyChannelList = 'notifyChannelList',
}

export interface IItemStorageReqSetItem {
	targetAppName?: AppItemName,
	itemName: IItemStorageItemType,
	itemContent: string
}

export interface IItemStorageReqGetItem {
	targetAppName?: AppItemName,
	itemName: IItemStorageItemType,
}


