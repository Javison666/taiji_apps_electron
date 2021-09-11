import { sleep } from 'client/common/time';
import Logger from 'client/platform/environment/node/logger';
import { AppItemName } from 'client/workbench/protocals/commonProtocal';
import { BrowserWindow } from 'electron';

export const hanleWindowRenderProtect = async (win: BrowserWindow, appName: AppItemName, cb?: () => void) => {
	try {
		await sleep(2000)
		let isSuccess = false
		win.webContents.executeJavaScript('Boolean(window.PageLoaded)').then(res => {
			Logger.INSTANCE.info(appName, 'isWindowRenderSuccess info.', res)
			if (res) {
				isSuccess = true
			}

		})
		setTimeout(() => {
			if (!isSuccess) {
				win.webContents.reload()
				Logger.INSTANCE.info(appName, 'isWindowRenderSuccess reload.')
				if (cb) {
					cb()
				}
				hanleWindowRenderProtect(win, appName, cb)
			}
		}, 1000)

	} catch (err) {
		Logger.INSTANCE.info(appName, 'isWindowRenderSuccess err.', err)
	}

}
