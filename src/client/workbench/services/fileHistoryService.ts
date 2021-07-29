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
			`create table if not exists file_history(app_name text, file_path text)`,
		)
	}

	async getFileHistotyList(appName: AppItemName): Promise<void> {
		// ShareStorage.INSTANCE.allSql()
	}
}

export default FileHistoryService
