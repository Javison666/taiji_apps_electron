// 限于 Share_Process
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import { ILightCodeApp, LightCodeChannelCommand } from 'client/workbench/protocals/lightCodeServiceProtocal'
import Logger from 'client/platform/environment/node/logger'
import fs = require('fs-extra')
import path = require('path')
import LightCodeService, { ITaskConf } from 'client/workbench/services/lightCodeService/lightCodeService'
import { fileFromUserDataCommon } from 'client/base/common/network'

export const lightCodeDir = fileFromUserDataCommon('./backdata/ttcode')

export interface ILightCodeTaskMap {
	conf: ITaskConf,
	process: Worker
}

export const lightCodeTaskMap: Map<string, ILightCodeTaskMap> = new Map()

export function stopLightCodeTaskByName(name: string) {
	let taskItem = lightCodeTaskMap.get(name)
	if (taskItem) {
		taskItem.process.terminate()
		lightCodeTaskMap.delete(name)
	}
}

class LightCodeWebWorker {
	public static readonly INSTANCE = new LightCodeWebWorker()
	private static readonly _path = '../../../workbench/workers/index/lightCode.js'
	constructor() { }

	createWorker(lightConf: ILightCodeApp) {
		const worker = new Worker(LightCodeWebWorker._path);
		worker.postMessage(lightConf);
		worker.onmessage = function (e) {
			const { data } = e
			if (data === 'exit') {
				return worker.terminate()
			}
			worker.terminate()
		};
	}
}

export const lightCodehandleChannelTask = async (appName: AppItemName, channelData: { channelCommand: string, reqData: any }) => {
	switch (channelData.channelCommand) {
		case LightCodeChannelCommand.subCommand.runLightCodeTaskByName:
			const conf = LightCodeService.INSTANCE.decodeLightCodeFileSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))
			LightCodeWebWorker.INSTANCE.createWorker(conf)
			return
		case LightCodeChannelCommand.subCommand.getLightCodeAppList:
			try {
				const list = fs.readdirSync(lightCodeDir)
				return list.filter(i => i.endsWith('.tt')).map(i => i.substr(0, i.length - 3))
			} catch (err) {
				Logger.INSTANCE.error('getLightCodeAppList err:', err);
			}
			return
		case LightCodeChannelCommand.subCommand.getLightCodeTaskByName:
			return LightCodeService.INSTANCE.decodeLightCodeFileSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))

		case LightCodeChannelCommand.subCommand.stopLightCodeTaskByName:
			return stopLightCodeTaskByName(channelData.reqData.name)

		case LightCodeChannelCommand.subCommand.isLightCodeTaskFileExistedByName:
			const uri = path.join(lightCodeDir, `${channelData.reqData.name}.tt`)
			Logger.INSTANCE.error('isLightCodeTaskFileExistedByName uri:', uri);
			return fs.pathExistsSync(uri)

		case LightCodeChannelCommand.subCommand.saveLightCodeApp:
			return LightCodeService.INSTANCE.encodeLightCodeFileSync(channelData.reqData, path.join(lightCodeDir, `${channelData.reqData.name}.tt`))

		case LightCodeChannelCommand.subCommand.delLightCodeAppByName:
			stopLightCodeTaskByName(channelData.reqData.name)
			return fs.rmSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))
		default:
			break
	}
	return null
}



