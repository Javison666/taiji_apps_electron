import { ipcRenderer } from 'electron';

class SharedProcessMain {
	async open(): Promise<void> {
		// Services
		await this.initServices();
	}

	private async initServices(): Promise<void> {

	}
}

export async function main(): Promise<void> {

	// create shared process and signal back to main that we are
	// ready to accept message ports as client connections
	const sharedProcess = new SharedProcessMain();
	ipcRenderer.send('vscode:shared-process->electron-main=ipc-ready');

	// await initialization and signal this back to electron-main
	await sharedProcess.open();
	ipcRenderer.send('vscode:shared-process->electron-main=init-done');
}

