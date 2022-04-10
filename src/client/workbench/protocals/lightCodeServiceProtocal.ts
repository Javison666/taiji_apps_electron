export const LightCodeChannelCommand = {
	mainCommand: 'lightCodeService',
	subCommand: {
		runLightCodeTaskByName: 'runLightCodeTaskByName',
		getLightCodeAppList: 'getLightCodeAppList',
		getLightCodeTaskByName: 'getLightCodeTaskByName',
		stopLightCodeTaskByName: 'stopLightCodeTaskByName',
		isLightCodeTaskFileExistedByName: 'isLightCodeTaskFileExistedByName',
		saveLightCodeApp: 'saveLightCodeApp',
		delLightCodeAppByName: 'delLightCodeAppByName',
	}
}

type ILowcodeAppName = string

export enum StepTypeCode {
	none = '',
	cmd = 'cmd',
	bash = 'bash'
}

export interface ILightCodeStepItem {
	stepType: StepTypeCode,
	remark: string,
	value: string
}

export interface ILightCodeApp {
	name: ILowcodeAppName,
	steps: ILightCodeStepItem[]
}
