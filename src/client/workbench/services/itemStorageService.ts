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
		switch (channelData.channelCommand) {
			case ItemStorageChannelCommand.subCommand.setItem:
				return this.setItem(appName, channelData.reqData)
			case ItemStorageChannelCommand.subCommand.getItem:
				return this.getItem(appName, channelData.reqData)
			default:
				break
		}
	}

	async getItem(appName: AppItemName, reqData: IItemStorageReqGetItem): Promise<void> {
		return ShareStorage.INSTANCE.allSql(
			`select * from item_storage where app_name='${appName}' and item_name='${reqData.itemName}';`
		)
	}

	async setItem(appName: AppItemName, reqData: IItemStorageReqSetItem): Promise<void> {
		return ShareStorage.INSTANCE.execSql(
			`INSERT OR IGNORE INTO item_storage (app_name, item_name, item_content) VALUES ('${appName}', '${reqData.itemName}', '${reqData.itemContent}');
			UPDATE item_storage SET item_content = '${reqData.itemContent}' WHERE app_name='${appName}' and item_name='${reqData.itemName}}';`
		)
	}
}

export default ItemStorageService
