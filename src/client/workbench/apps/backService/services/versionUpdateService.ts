import Logger from 'client/platform/environment/node/logger'
import axios from 'axios'
import { IHttpVersionUpdateServerResponse } from 'client/workbench/protocals/serverHttpProtocal'
import { ipcRenderer } from 'electron'
import path = require('path')
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import { isPackagedCommon } from 'client/base/common/network'
import { AppPackageName } from 'client/env'

const fsExtra = require('fs-extra')
const child_process = require('child_process')

const isCurrentVersionPkg = fsExtra.pathExistsSync(path.join(process.cwd(), '../../', `${AppPackageName}.exe`))

class VersionUpdateService {
	public static readonly INSTANCE = new VersionUpdateService()
	private _timeInterval = 600000
	private _version = ''

	get isCurrentVersionPkg() {
		return isCurrentVersionPkg
	}

	get versionDir() {
		if (isCurrentVersionPkg) {
			return path.join(process.cwd(), '../../', 'versions')
		} else {
			return path.join(process.cwd(), 'versions')
		}
	}

	async main() {
		try {
			this.startup()
		} catch (err) {
			Logger.INSTANCE.error('VersionUpdateService', err)
		}
	}

	async startup() {
		this.loopCheckUpdate()
	}

	async loopCheckUpdate() {
		setTimeout(async () => {
			VersionUpdateService.INSTANCE.loopCheckUpdate()
		}, this._timeInterval)
	}

	async checkUpdate(account: string) {
		try {
			const response = await axios({
				method: 'post',
				url: `https://*.*.com/api/portrait/isUpdate`,
				data: {
					"platform": 1,
					"versionNo": 'cur_version'
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const res: IHttpVersionUpdateServerResponse = response.data
			Logger.INSTANCE.error('checkUpdate res', res)
			if (res.code === 1 && res.data && res.data.versionNo) {
				if (res.data.versionNo === this._version) {
					return
				}
				this._version = res.data.versionNo
				const versionPath = this.versionDir

				await fsExtra.mkdirp(versionPath)
				// 下载新版本包
				const downloadPath = await ipcRenderer.invoke('client:downloadFile', AppItemName.Back_Service, res.data)
				Logger.INSTANCE.info('downloadPath', downloadPath)
				if (downloadPath) {
					// 下载成功
					const newVersionPkgPath = path.join(versionPath, res.data.versionNo)
					const newVersionPkdData = `${newVersionPkgPath}.zip`
					Logger.INSTANCE.info('del newVersionPkdData', newVersionPkgPath)
					await fsExtra.remove(newVersionPkgPath)
					// 移动到版本管理目录
					Logger.INSTANCE.info('checkUpdate move start', downloadPath, '->', newVersionPkdData)
					await fsExtra.move(downloadPath, newVersionPkdData)
					// 解压
					try {
						await this.runUnzipVersion(res.data.versionNo)
						await fsExtra.remove(newVersionPkdData)
					} catch (extractErr) {
						Logger.INSTANCE.error('extractErr error', extractErr)
					}
					const ink_cwd = path.join(newVersionPkgPath, 'resources/public')
					Logger.INSTANCE.info('ink_cwd cwd:', ink_cwd)
					child_process.execFile('ink_cwd.bat', [], { cwd: ink_cwd }, function (error: any, stdout: any, stderr: any) {
						stdout && Logger.INSTANCE.info('syncQMXInk stdout: ', stdout)
					})
				}
			} else {
				Logger.INSTANCE.error('checkUpdate req err', res)
			}
		} catch (err) {
			Logger.INSTANCE.error('checkUpdate error', err)
		}
	}

	async runUnzipVersion(version: string) {
		return new Promise((resolve, reject) => {
			const cmd = `".${isPackagedCommon() ? '\\resources' : ''}\\public\\7z.exe" x .\\versions\\${version}.zip -o.\\versions\\${version}`
			const cwd = path.join(this.versionDir, '../')
			Logger.INSTANCE.info('runUnzipVersion cmd:', cmd, cwd)
			const workerProcess = child_process.exec(cmd, { cwd })
			// 打印正常的后台可执行程序输出
			workerProcess.stdout.on('data', function (data: any) {
				Logger.INSTANCE.error('runUnzip error stdout', data)
			})
			// 打印错误的后台可执行程序输出
			workerProcess.stderr.on('data', function (data: any) {
				Logger.INSTANCE.error('runUnzip error stderr', data)
				reject(data)
			})
			// 退出之后的输出
			workerProcess.on('close', function (code: any) {
				Logger.INSTANCE.info('runUnzip end', code)
				resolve(null)
			})
		})
	}

}

export default VersionUpdateService
