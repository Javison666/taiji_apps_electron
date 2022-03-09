import axios from 'axios'
import { ipcRenderer } from 'electron';
import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import VersionDecoder from 'client/workbench/utils/versionDecoder'
import { getVersionCommon } from 'client/base/common/network'
import { IVersionInfoData, VersionUdtChannelCommand } from 'client/workbench/protocals/versionUdtServiceProtocal';
import { spawn } from 'child_process';

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

	public get newVersionInfo() {
		return {
			newVersionAvailable: VersionUdtService.INSTANCE._newVersionAvailable,
			newVersionReady: VersionUdtService.INSTANCE._newVersionReady,
			newVersionDetails: VersionUdtService.INSTANCE._newVersionDetails,
		}
	}

	// 备注：ecess错误为需要管理员模式
	public async updateClient() {
		try {
			if (!this.newVersionInfo.newVersionDetails.clientUrl) {
				return
			}
			Logger.INSTANCE.info('start download', VersionUdtService.INSTANCE.newVersionInfo)
			let versionUrl = VersionUdtService.INSTANCE.newVersionInfo.newVersionDetails.clientUrl
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
}

export default VersionUdtService

