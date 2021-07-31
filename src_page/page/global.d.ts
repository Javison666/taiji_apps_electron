interface IClient {
	ipcMessagePort: {
		connectApp: (appName: string) => Promise<void>,
		callApp: (appName: string, data: any) => Promise<any>
	},
	ipcRenderer: {
		showOpenDialog: (options: any) => Promise<string | undefined>
	}
}

declare var client: IClient
