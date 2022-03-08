declare var PageLoaded: Boolean

interface IClient {
	bridge: {
		// 通知消息
		call: (...param: any) => void
	},
	app: {
		appName: string,
		userDataPath: string,
		userDataAppPath: string,
		isPackaged: boolean,
		hideWindow: () => void,
		destroyWindow: () => void,
		require: (moduleName: string) => any,
		getUuid: () => string,
	},
	ipcMessagePort: {
		connectApp: (appName: string) => Promise<void>,
		callApp: (appName: string, data: {
			channelType: string,
			channelCommand: string,
			reqData?: { [property: string]: any }
		}) => Promise<any>
	},
	ipcRenderer: {
		// 显示错误消息
		showErrorBox: (title: string, content: string) => void,
		// 显示消息提示框
		showMessageBox: (option: Electron.MessageBoxOptions) => void,
		showOpenDialog: (options: any) => Promise<string | undefined>,
		invoke: (channel: string, ...args: any) => Promise<any>,
		send: (channel: string, ...args: any) => void,
		on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer
	}
}

declare var client: IClient


