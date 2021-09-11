class UtilService {
	public static readonly INSTANCE = new UtilService()

	async main(): Promise<void> {
	}

	async handleTask(fromAppName: string, channelData: { channelCommand: string, reqData: any }) {
		switch (channelData.channelCommand) {
			default:
				break
		}
		return null
	}
}

export default UtilService
