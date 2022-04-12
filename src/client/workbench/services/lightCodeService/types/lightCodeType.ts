export type commandText = string

export enum InstructorPlatformType {
	Full = 0,
	Windows = 1,
	MacOs = 2,
	Linux = 3
}

export enum InstructorCategoryType {
	System = 0,
}



export interface ILightCodeCommand {
	commandType: number,
	categoryType: number,
	platformType: number,
	payload: string
}



// // 与创建的子进程进行通讯
// export enum LightCodeTaskCmdType {
// 	C2M_ChildProcessInit = 'C2M_ChildProcessInit',
// 	M2C_LightCodeTask = 'M2C_LightCodeTask'
// }

// // 与创建的子进程进行通讯协议体
// export interface ILightCodeTask<T> {
// 	cmd: LightCodeTaskCmdType,
// 	data: T
// }
