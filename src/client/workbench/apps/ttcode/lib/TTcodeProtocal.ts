// 与创建的子进程进行通讯
export enum TTcodeTaskCmdType {
	C2M_ChildProcessInit = 'C2M_ChildProcessInit',
	M2C_TTcodeTask = 'M2C_TTcodeTask'
}

// 与创建的子进程进行通讯协议体
export interface ITTcodeTask<T> {
	cmd: TTcodeTaskCmdType,
	data: T
}
