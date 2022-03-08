import axios from 'axios'
import { ipcRenderer } from 'electron';
import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import VersionDecoder from 'client/workbench/utils/versionDecoder'
import { getVersionCommon } from 'client/base/common/network'
import * as path from 'path'
import { IVersionInfoData, VersionUdtChannelCommand } from 'client/workbench/protocals/versionUdtServiceProtocal';
import * as ini from 'ini'
import fs = require('fs')
import { spawn } from 'child_process';
import { AppPackageName } from 'client/env';
const fsExtra = require('fs-extra')

interface IVersionCheckData {
	// 新增优化功能
	addRemarkList: string[],
	improveRemarkList: string[],
	repairRemarkList: string[],
	// 最低使用版本
	// baseVersionNo: string,
	// 当前稳定版本的下载地址
	// stableVersionUrl: string,
	// 更新至版本号
	versionNo: string,
	// 更新至的版本地址
	clientUrl: string,
	// 屏蔽版本号集
	// blackVersions: string[]
}

interface IVersionIni {
	common: {
		ver: string
	}
}

export const isCurrentVersionPkg = fsExtra.pathExistsSync(path.join(process.cwd(), '../../', `${AppPackageName}.exe`)) && fsExtra.pathExistsSync(path.join(process.cwd(), '../../', `versions`))

// 主要功能在shareProcess中运行
class VersionUdtService {
	public static readonly INSTANCE = new VersionUdtService()

	private _curVersion = ''

	private _newVersionAvailable = false
	private _newVersionReady = false
	private _newVersionDetails: IVersionInfoData = {
		addRemarkList: [],
		improveRemarkList: [],
		repairRemarkList: [],
		versionNo: '',
		clientUrl: '',
	}

	async handleTask(appName: AppItemName, channelData: { channelCommand: string, reqData: any }) {
		// let targetAppName = appName
		// if (channelData.reqData && channelData.reqData.targetAppName) {
		// 	targetAppName = channelData.reqData.targetAppName
		// }
		switch (channelData.channelCommand) {
			case VersionUdtChannelCommand.subCommand.getNewVersionInfo:
				return VersionUdtService.INSTANCE.newVersionInfo
			case VersionUdtChannelCommand.subCommand.startUdtClient:
				return VersionUdtService.INSTANCE.updateClient()
			default:
				break
		}
	}

	get rootDir() {
		if (isCurrentVersionPkg) {
			return path.join(process.cwd(), '../../')
		} else {
			return path.join(process.cwd())
		}
	}

	get versionDir() {
		if (isCurrentVersionPkg) {
			return path.join(process.cwd(), '../../', 'versions')
		} else {
			return path.join(process.cwd(), 'versions')
		}
	}

	public get newVersionInfo() {
		return {
			newVersionAvailable: VersionUdtService.INSTANCE._newVersionAvailable,
			newVersionReady: VersionUdtService.INSTANCE._newVersionReady,
			newVersionDetails: VersionUdtService.INSTANCE._newVersionDetails,
		}
	}

	public async updateClient() {
		try {
			if (!this.newVersionInfo.newVersionDetails.clientUrl) {
				return
			}
			Logger.INSTANCE.info('start download', VersionUdtService.INSTANCE.newVersionInfo)
			let versionUrl = VersionUdtService.INSTANCE.newVersionInfo.newVersionDetails.clientUrl
			// let versionNo = VersionUdtService.INSTANCE.newVersionInfo.newVersionDetails.versionNo
			await fsExtra.mkdirp(VersionUdtService.INSTANCE.versionDir)
			// 下载新版本包
			const downloadPath = await ipcRenderer.invoke('client:downloadFile', {
				appName: AppItemName.Sys_Udt_App,
				url: versionUrl,
				isProcessListen: true,
				type: 'versionFile'
			})
			Logger.INSTANCE.info('downloadPath', downloadPath)
			if (downloadPath) {
				spawn(downloadPath, ['/S'], {
					detached: true,
					stdio: ['ignore', 'ignore', 'ignore'],
					windowsVerbatimArguments: true
				});
			}

		} catch (err) {
			Logger.INSTANCE.error('updateClient err', err)
		}
	}

	public async startLoopCheckUdt() {
		VersionUdtService.INSTANCE._curVersion = await getVersionCommon()
		VersionUdtService.INSTANCE._loopCheckUdt()
	}

	private async _loopCheckUdt() {
		try {
			const response = await axios({
				method: 'get',
				url: `http://sprotect.tpddns.cn:29999/client-tool/version/versionCheck?time=${Date.now()}`,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			if (response && response.data) {
				const data: IVersionCheckData = response.data
				if (VersionDecoder.compareVer(new VersionDecoder(data.versionNo), new VersionDecoder(VersionUdtService.INSTANCE._curVersion)) > 0) {
					VersionUdtService.INSTANCE._newVersionAvailable = true
					VersionUdtService.INSTANCE._newVersionDetails = data
				} else {
					VersionUdtService.INSTANCE._newVersionAvailable = false
				}
			}

			setTimeout(() => {
				VersionUdtService.INSTANCE._loopCheckUdt()
			}, 600000)
		} catch (err) {
			Logger.INSTANCE.error('loopCheckUdt error', err)
		}
	}

	// 切换为版本号启动模式，因为目前稳定，所以暂时不启用
	async udtVersionIni(versionNo: string) {
		try {
			const iniData: IVersionIni = {
				common: {
					ver: versionNo
				}
			}
			fs.writeFileSync(path.join(VersionUdtService.INSTANCE.versionDir, 'version.ini'), ini.stringify(iniData), {
				encoding: 'utf-8'
			})
		} catch (err) {
			Logger.INSTANCE.error('udtVersionIni', err)
		}
	}
}

export default VersionUdtService
