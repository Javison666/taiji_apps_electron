export type commandText = string

export enum InstructorPlatformType {
	Full,
	Windows,
	MacOs,
	Linux3
}

export enum InstructorCategoryType {
	System,
	Node,
}

export enum CommandRunStatusType {
	Ready,
	Runing,
	Failed,
	Finished
}

export enum CommandPayloadDataType {
	Text,
	Json
}

export interface ILightCodeCommand {
	step: number,
	statusType: CommandRunStatusType,
	statusDesc: string,
	commandType: number,
	categoryType: number,
	platformType: number,
	relyOutSteps: number[],
	payload: string,
	payloadDataType: CommandPayloadDataType
}
