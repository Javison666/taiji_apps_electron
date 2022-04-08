// 限于 Share_Process
import { AppItemName } from 'client/workbench/protocals/commonProtocal'
import { LightCodeChannelCommand } from 'client/workbench/protocals/lightCodeServiceProtocal'
import Logger from 'client/platform/environment/node/logger'
import fs = require('fs-extra')
import path = require('path')
import LightCodeService, { ITaskConf } from 'client/workbench/services/lightCodeService/lightCodeService'
import { fileFromUserDataCommon } from 'client/base/common/network'
import { app, BrowserWindow } from 'electron'

export const lightCodeDir = fileFromUserDataCommon('./backdata/ttcode')

export interface ILightCodeTaskMap {
	conf: ITaskConf,
	process: BrowserWindow
}

export const lightCodeTaskMap: Map<string, ILightCodeTaskMap> = new Map()

export function stopLightCodeTaskByName(name: string) {
	let taskItem = lightCodeTaskMap.get(name)
	if (taskItem) {
		taskItem.process.destroy()
		lightCodeTaskMap.delete(name)
	}
}

export const lightCodehandleChannelTask = async (appName: AppItemName, channelData: { channelCommand: string, reqData: any }) => {
	switch (channelData.channelCommand) {
		case LightCodeChannelCommand.subCommand.runTTcodeTaskByName:
			break
		case LightCodeChannelCommand.subCommand.getLightCodeAppList:
			try {
				const list = fs.readdirSync(lightCodeDir)
				return list.filter(i => i.endsWith('.tt')).map(i => i.substr(0, i.length - 3))
			} catch (err) {
				Logger.INSTANCE.error('getTTcodeAppList err:', err);
			}
			return

		case LightCodeChannelCommand.subCommand.getLightCodeTaskByName:
			return LightCodeService.INSTANCE.decodeTTFileSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))

		case LightCodeChannelCommand.subCommand.stopLightCodeTaskByName:
			return stopLightCodeTaskByName(channelData.reqData.name)

		case LightCodeChannelCommand.subCommand.isLightCodeTaskFileExistedByName:
			return fs.pathExistsSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))

		case LightCodeChannelCommand.subCommand.saveLowcodeApp:
			return LightCodeService.INSTANCE.encodeTTFileSync(channelData.reqData, path.join(lightCodeDir, `${channelData.reqData.name}.tt`))

		case LightCodeChannelCommand.subCommand.delLowcodeAppByName:
			stopLightCodeTaskByName(channelData.reqData.name)
			return fs.rmSync(path.join(lightCodeDir, `${channelData.reqData.name}.tt`))
		default:
			break
	}
	return null
}
