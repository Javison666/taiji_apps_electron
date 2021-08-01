import { fileFromUserDataCommon, fileCreateIfNotExisted } from 'client/base/common/network'
const sqlite3 = require('sqlite3').verbose();

class ShareStorage {
	public static readonly INSTANCE = new ShareStorage();

	private _db: any = null;

	async main(): Promise<void> {
		try {
			await this.startup();
		} catch (error) {
			console.error(error.message);
		}
	}

	private async startup(): Promise<void> {

		let dbPath = await fileFromUserDataCommon('./storage/share_storage.db')
		console.log(dbPath)
		fileCreateIfNotExisted(dbPath)
		this._db = new sqlite3.Database(dbPath)
	}

	async runSql(sql: string, params?: (string | number)[]): Promise<void> {
		return new Promise((resolve, reject) => {
			this._db.run(sql, params, (error: any) => {
				if (error === null) {
					resolve()
				} else {
					reject(error)
				}
			})
		})
	}

	async getSql<T>(sql: string, params?: (string | number)[]): Promise<T> {
		return new Promise((resolve, reject) => {
			this._db.get(sql, params, (error: any, row: T) => {
				if (error === null) {
					resolve(row)
				} else {
					reject(error)
				}
			})
		})
	}

	async allSql<T>(sql: string, params?: (string | number)[]): Promise<T> {
		return new Promise((resolve, reject) => {
			this._db.all(sql, params, (error: any, rows: T) => {
				if (error === null) {
					resolve(rows)
				} else {
					reject(error)
				}
			})
		})
	}

	async eachSql<T>(sql: string, params?: (string | number)[], eachCb?: (error: any, row: T) => void): Promise<void> {
		return new Promise((resolve) => {
			this._db.each(sql, params, eachCb, () => {
				resolve()
			})
		})
	}

	async execSql<T>(sql: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this._db.exec(sql, (error: any) => {
				if (error === null) {
					resolve()
				} else {
					reject(error)
				}
			})
		})
	}

}

export default ShareStorage
