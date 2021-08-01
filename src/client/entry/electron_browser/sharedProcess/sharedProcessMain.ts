import { ipcRenderer } from 'electron';
import fileHistoryService from 'client/workbench/services/fileHistoryService'
import { AppItemName } from 'client/workbench/apps/appsEnum'
import ShareStorage from 'client/base/parts/storage/node/shareStorage'

class SharedProcessMain {
	async open(): Promise<void> {
		this.registerListeners()
		// Services
		await this.initServices();
	}

	private async initServices(): Promise<void> {
		await ShareStorage.INSTANCE.main()
		await fileHistoryService.INSTANCE.main()
	}

	private registerListeners(): void {

		// 提供代理消息通道
		ipcRenderer.on('provide-apps-channel-event', (event, fromAppName) => {
			const [port] = event.ports
			port.onmessage = (event) => {
				const channelData = event.data
				// const channelData = JSON.parse(event.data)
				switch (channelData.channelType) {
					case 'fileHistory':
						this.handleFileHistoryEvent(fromAppName, port, channelData)
						break;
					default:
						break;
				}
			}
		})
	}

	private async handleFileHistoryEvent(fromAppName: AppItemName, port: MessagePort, channelData: any): Promise<void> {
		const rows = await fileHistoryService.INSTANCE.handleTask(fromAppName, channelData)
		port.postMessage({
			seq: channelData.seq,
			data: rows,
		})
	}
}

export async function main(): Promise<void> {

	// create shared process and signal back to main that we are
	// ready to accept message ports as client connections
	const sharedProcess = new SharedProcessMain();
	ipcRenderer.send('client:shared-process->electron-main=ipc-ready');

	// await initialization and signal this back to electron-main
	await sharedProcess.open();
	ipcRenderer.send('client:shared-process->electron-main=init-done');
}

