import { ipcMain } from 'electron'
import { ITaskConf } from 'client/workbench/apps/ttcode/lib/TTcodeService'
import TTcode from 'client/workbench/apps/ttcode/electron-main'
import Logger from 'client/platform/environment/node/logger'

// ttcode模块
export default () => {

	// 执行任务
	ipcMain.handle('client:runTTcodeTaskByName', async (event, name: string) => {
		try {
			const ttcodeTaskConf = TTcode.INSTANCE.getTTcodeTaskByName(name)
			ttcodeTaskConf && await TTcode.INSTANCE.main(ttcodeTaskConf)
		} catch (err) {
			Logger.INSTANCE.error('runTTcodeTaskByName err:', err);
		}
		return
	})

	// 获取所有任务列表
	ipcMain.handle('client:getTTcodeAppList', async () => {
		return TTcode.INSTANCE.getTTcodeAppList()
	})


	ipcMain.handle('client:getTTcodeTaskByName', async (event, name: string) => {
		return TTcode.INSTANCE.getTTcodeTaskByName(name)
	})

	ipcMain.handle('client:stopTTcodeTaskByName', async (event, name: string) => {
		return TTcode.INSTANCE.stopTTcodeTaskByName(name)
	})

	ipcMain.handle('client:isTTcodeTaskFileExistedByName', async (event, name) => {
		return TTcode.INSTANCE.isTTcodeTaskFileExisted(name)
	})

	ipcMain.handle('client:saveLowcodeApp', async (event, ttcodeTaskConf: ITaskConf) => {
		return TTcode.INSTANCE.saveLowcodeApp(ttcodeTaskConf)
	})

	ipcMain.handle('client:delLowcodeAppByName', async (event, name: string) => {
		return TTcode.INSTANCE.delLowcodeAppByName(name)
	})
}

