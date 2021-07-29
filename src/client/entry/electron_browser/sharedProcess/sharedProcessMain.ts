import { ipcRenderer } from 'electron';

class SharedProcessMain {
	async open(): Promise<void> {
		this.registerListeners()
		// Services
		await this.initServices();
	}

	private async initServices(): Promise<void> {
		// win.webContents.id
	}

	private registerListeners(): void {

		// 提供代理消息通道
		ipcRenderer.on('provide-apps-channel-event', (event) => {
			const [port] = event.ports
			port.onmessage = (event) => {
				// The event data can be any serializable object (and the event could even
				// carry other MessagePorts with it!)
				port.postMessage({
					type: 'share_process'
				})
			}
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

