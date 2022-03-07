import ClientApplication from 'client/entry/electron_main/app'
import Logger from 'client/platform/environment/node/logger'
import { AppItemName } from 'client/workbench/protocals/commonProtocal'

export type urlStr = string
export type downloadProcess = Number

// 在线文件用于回调
export const downloadCb: {
	[propertyNames: string]: {
		item?: Electron.DownloadItem,
		cb: (...params: any) => void
	}
} = {}

// 记录下载进度用于通知
export const downloadProcessMap: Map<urlStr, {
	appName: AppItemName,
	isProcessListen: boolean,
	type?: string | number,
	process: downloadProcess
}> = new Map()


class downloadService {
	public static readonly INSTANCE = new downloadService()

	handleDownload(appName: AppItemName, url: string) {
		return new Promise(resolve => {
			try {
				let win
				win = ClientApplication.INSTANCE.windowAppsMap.get(appName)
				Logger.INSTANCE.info('downloadURL find win', appName)
				if (win) {
					downloadCb[url] = {
						cb: (filePath) => {
							resolve(filePath)
						}
					}
					Logger.INSTANCE.info('downloadURL start', url)
					win.webContents.downloadURL(url)
				} else {
					resolve(null)
				}
			} catch (err) {
				Logger.INSTANCE.error('handleDownloadErr', err)
				resolve(null)
			}
		})
	}

	updateProcess(uri: urlStr, processNum: number) {
		let downItem = downloadProcessMap.get(uri)
		if (downItem) {
			downItem.process = processNum
			downloadProcessMap.set(uri, downItem)
			if (downItem.isProcessListen) {
				let win = ClientApplication.INSTANCE.windowAppsMap.get(downItem.appName)
				if (win) {
					win.webContents.send('render:updateDownloadProcess', {
						uri,
						process: downItem.process
					})
				}
			}
		}
	}

}

export default downloadService

