import ShareStorage from 'client/base/parts/storage/node/shareStorage'
import { AppItemName } from 'client/workbench/apps/appsEnum'

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
			`create table if not exists file_history(app_name text, file_path text, update_time  TimeStamp NOT NULL DEFAULT (datetime('now','localtime')));`,
		)
	}

	async handleTask(appName: AppItemName, channelData: { channelCommond: string, reqData: any }) {
		console.log('handleTask', appName, channelData)
		switch (channelData.channelCommond) {
			case 'addFileHistory':
				return this.addFileHistory(appName, channelData.reqData)
			default:
				break
		}
	}

	async getAppFileHistotyList(appName: AppItemName): Promise<void> {
		return ShareStorage.INSTANCE.allSql(
			`select * from file_history where app_name='${appName}';`
		)
	}



	async addFileHistory(appName: AppItemName, reqData: { filePath: string }): Promise<void> {

		return ShareStorage.INSTANCE.execSql(
			`insert into file_history (app_name, file_path)
			VALUES ('${appName}', '${reqData.filePath}');`
		)
	}

	async delFileHistory(appName: AppItemName, reqData: { filePath: string }): Promise<void> {
		return ShareStorage.INSTANCE.execSql(
			`delete from file_history where appName = '${appName} and filePath = '${reqData.filePath}';`
		)
	}
}

export default FileHistoryService
