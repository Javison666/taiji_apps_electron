export type commandText = string

export enum CommandPlatformType {
	Full,
	Windows,
	Mac,
	Linux
}

export enum CommandCategoryType {
	System,
	Node,
	Browser,
	Electron,
}

export enum CommandRunStatusType {
	Ready,
	Runing,
	Skip,
	Failed,
	Finished
}

export enum CommandPayloadDataType {
	Text,
	Json
}

export interface ILightCodeCommandBase {
	step: number,
	commandType: number,
	categoryType: number,
	platformType: number,
	relyOutSteps: number[],
	payload: string,
	payloadDataType: CommandPayloadDataType,
}

export interface ILightCodeCommandRun extends ILightCodeCommandBase {
	statusType: CommandRunStatusType,
	statusDesc: string,
	relyOutSteps: number[],
	out: any
}
