import Logger from 'client/platform/environment/node/logger'
// import VersionUpdateService from 'client/workbench/apps/backService/services/versionUpdateService'

class BackServiceApp {
	public static readonly INSTANCE = new BackServiceApp()

	async main(): Promise<void> {
		try {
			this.startup()
		} catch (err) {
			Logger.INSTANCE.error('BackServiceApp', err)
		}
	}

	private async startup(): Promise<void> {

		client.ipcMessagePort.registerHandlePortMessage(async (appName: string, data: any) => {
			try {
				const reqData = data.data
				switch (reqData.channelType) {
					default:
						break
				}
			} catch (err) {
				Logger.INSTANCE.error('BizShareProcess.main', err)
			}
			return null
		})
	}
}

export default BackServiceApp
