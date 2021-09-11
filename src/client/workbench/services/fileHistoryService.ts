import ShareStorage from 'client/base/parts/storage/node/shareStorage'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import { FileHistoryChannelCommand } from 'client/workbench/protocals/fileHistoryProtocal'

class FileHistoryService {
	public static readonly INSTANCE = new FileHistoryService();

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {
		await ShareStorage.INSTANCE.execSql(
			`create table if not exists file_history(id integer PRIMARY KEY autoincrement, app_name text, file_path text, update_time  TimeStamp NOT NULL DEFAULT (datetime('now','localtime')));`,
		)
	}

	async handleTask(appName: AppItemName, channelData: { channelCommand: string, reqData: any }) {
		switch (channelData.channelCommand) {
			case FileHistoryChannelCommand.subCommand.getFilesHistoryList:
				return this.getFilesHistoryList(appName)
			case FileHistoryChannelCommand.subCommand.addFileHistory:
				return this.addFileHistory(appName, channelData.reqData)
			default:
				break
		}
	}

	async getFilesHistoryList(appName: AppItemName): Promise<void> {
		return ShareStorage.INSTANCE.allSql(
			`select * from file_history where app_name='${appName}' order by update_time desc limit 100;`
		)
	}

	async addFileHistory(appName: AppItemName, reqData: { filePath: string }): Promise<void> {
		await this.delFileHistory(appName, reqData)
		return ShareStorage.INSTANCE.execSql(
			`insert into file_history (app_name, file_path)
			VALUES ('${appName}', '${reqData.filePath}');`
		)
	}

	async delFileHistory(appName: AppItemName, reqData: { filePath: string }): Promise<void> {
		return ShareStorage.INSTANCE.execSql(
			`delete from file_history where app_name = '${appName}' and file_path = '${reqData.filePath}';`
		)
	}

	async clearFileHistory(appName: AppItemName): Promise<void> {
		return ShareStorage.INSTANCE.execSql(
			`delete from file_history where app_name = '${appName}';`
		)
	}
}

export default FileHistoryService
