import axios from 'axios'

export interface IDebuggerTab {
	description: string
	devtoolsFrontendUrl: string
	id: string
	title: string
	type: string
	url: string
	webSocketDebuggerUrl: string
}

export class CdpHandler {

	public static readonly INSTANCE = new CdpHandler()

	public async getDebuggerTabs(httpAddr: string) {
		let debuggerTabs: IDebuggerTab[] = []
		const res = await axios.get(`${httpAddr}/json`).catch(err => {
			throw new Error(err)
		})
		if (res) {
			debuggerTabs = res.data
		}
		return debuggerTabs
	}

	// private async connect() {

	// }
}

export default CdpHandler
