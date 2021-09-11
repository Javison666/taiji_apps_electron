declare var PageLoaded: Boolean

interface IClient {
	app: {
		appName: string,
		userDataPath: string,
		userDataAppPath: string,
		isPackaged: boolean,
		require: (moduleName: string) => any
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
		showOpenDialog: (options: any) => Promise<string | undefined>,
		invoke: (channel: string, ...args: any) => Promise<any>
	}
}

declare var client: IClient
