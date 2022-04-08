// 与创建的子进程进行通讯
export enum LightCodeTaskCmdType {
	C2M_ChildProcessInit = 'C2M_ChildProcessInit',
	M2C_LightCodeTask = 'M2C_LightCodeTask'
}

// 与创建的子进程进行通讯协议体
export interface ILightCodeTask<T> {
	cmd: LightCodeTaskCmdType,
	data: T
}
