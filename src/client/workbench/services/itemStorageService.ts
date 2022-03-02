import ShareStorage from 'client/base/parts/storage/node/shareStorage'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import {
	ItemStorageChannelCommand,
	IItemStorageReqSetItem,
	IItemStorageReqGetItem
} from 'client/workbench/protocals/itemStorageProtocal'

class ItemStorageService {
	public static readonly INSTANCE = new ItemStorageService();

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		await ShareStorage.INSTANCE.execSql(
			`create table if not exists item_storage(id integer PRIMARY KEY autoincrement, app_name text, item_name text unique, item_content text, update_time  TimeStamp NOT NULL DEFAULT (datetime('now','localtime')));
			CREATE INDEX IF NOT EXISTS item_storage_item_name_idx ON item_storage (item_name);`,
		)
	}

	async handleTask(appName: AppItemName, channelData: { channelCommand: string, reqData: any }) {
		let targetAppName = appName
		if (channelData.reqData && channelData.reqData.targetAppName) {
			targetAppName = channelData.reqData.targetAppName
		}
		switch (channelData.channelCommand) {
			case ItemStorageChannelCommand.subCommand.setItem:
				return this.setItem(targetAppName, channelData.reqData)
			case ItemStorageChannelCommand.subCommand.getItem:
				return this.getItem(targetAppName, channelData.reqData)
			case ItemStorageChannelCommand.subCommand.getItemContent:
				return this.getItemContent(targetAppName, channelData.reqData)
			default:
				break
		}
	}

	async getItem(appName: AppItemName, reqData: IItemStorageReqGetItem): Promise<void> {
		return ShareStorage.INSTANCE.getSql(
			`select * from item_storage where app_name='${appName}' and item_name='${reqData.itemName}';`
		)
	}

	async getItemContent(appName: AppItemName, reqData: IItemStorageReqGetItem): Promise<void> {
		let itemData: any = await ShareStorage.INSTANCE.getSql(
			`select * from item_storage where app_name='${appName}' and item_name='${reqData.itemName}';`
		)
		if (itemData && itemData.item_content) {
			return itemData.item_content
		}
		return itemData
	}

	async setItem(appName: AppItemName, reqData: IItemStorageReqSetItem): Promise<void> {
		// let sql = `INSERT OR IGNORE INTO item_storage (app_name, item_name, item_content) VALUES ('${appName}', '${reqData.itemName}', '${reqData.itemContent}');
		// UPDATE item_storage SET item_content = '${reqData.itemContent}' WHERE app_name='${appName}' and item_name='${reqData.itemName}}';`
		let sql = `INSERT OR REPLACE INTO item_storage (app_name, item_name, item_content) VALUES ('${appName}', '${reqData.itemName}', '${reqData.itemContent}');
		UPDATE item_storage SET item_content = '${reqData.itemContent}' WHERE app_name='${appName}' and item_name='${reqData.itemName}}';`
		return ShareStorage.INSTANCE.execSql(
			sql
		)
	}
}

export default ItemStorageService
