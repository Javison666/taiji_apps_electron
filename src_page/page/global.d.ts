interface IClient {
	ipcMessagePort: {
		connectApp: (appName: string) => Promise<void>,
		callApp: (appName: string, data: any) => Promise<any>
	}
}

declare var client: IClient
