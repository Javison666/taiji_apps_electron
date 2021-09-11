export const ItemStorageChannelCommand = {
	mainCommand: 'itemStorage',
	subCommand: {
		setItem: 'setItem',
		getItem: 'getItem'
	}
}

export interface IItemStorageReqSetItem {
	itemName: string,
	itemContent: string
}

export interface IItemStorageReqGetItem {
	itemName: string,
}
