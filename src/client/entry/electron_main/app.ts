import { ipcMain, MessageChannelMain, BrowserWindow } from 'electron'
import { onUnexpectedError } from 'client/base/common/errors'
import logger from 'client/common/log'
import { AppItemName } from 'client/workbench/apps/appsEnum'
import { SharedProcess } from 'client/platform/sharedProcess/electron-main/sharedProcess'
import LoginBench from 'client/workbench/main/loginBench'

/**
 * The main client application. There will only ever be one instance,
 * even if the user starts many instances (e.g. from the command line).
 */
export class ClientApplication {

	public static readonly INSTANCE = new ClientApplication();
	public windowAppsMap: Map<AppItemName, BrowserWindow> = new Map()

	async startup(): Promise<void> {

		this.registerListeners()
		this.launchProcess()

		// logger.debug(`from: ${this.environmentMainService.appRoot}`);
		// logger.debug('args:', this.environmentMainService.args);

		// Main process server (electron IPC based)
		// const mainProcessElectronServer = new ElectronIPCServer();

		// Resolve unique machine ID
		// logger.info('Resolving machine identifier...');
		// const machineId = await this.resolveMachineId();
		// logger.info(`Resolved machine identifier: ${machineId}`);

	}


	private async launchProcess(): Promise<void> {
		const sharedProcess = new SharedProcess();
		logger.info('SharedProcess start connect!');
		await sharedProcess.connect();
		logger.info('SharedProcess connect success!');

		// 进入登录UI
		new LoginBench().main()
	}

	private registerListeners(): void {
		process.on('uncaughtException', err => this.onUnexpectedError(err));
		process.on('unhandledRejection', (reason: unknown) => onUnexpectedError(reason));

		ipcMain.on('client:toggleDevTools', event => event.sender.toggleDevTools());
		ipcMain.on('client:openDevTools', event => event.sender.openDevTools());

		ipcMain.on('client:reloadWindow', event => event.sender.reload());

		ipcMain.on('proxy-apps-channel-request', (event, appName: AppItemName) => {
			// For security reasons, let's make sure only the frames we expect can
			// access the worker.
			const targetWindow = this.windowAppsMap.get(appName)
			if (targetWindow && event.senderFrame === targetWindow.webContents.mainFrame) {
				// Create a new channel ...
				const { port1, port2 } = new MessageChannelMain()
				// ... send one end to the worker ...
				targetWindow.webContents.postMessage('proxy-apps-channel-event', null, [port1])
				// ... and the other end to the main window.
				event.senderFrame.postMessage('provide-apps-channel-event', null, [port2])
				// Now the main window and the worker can communicate with each other
				// without going through the main process!
			}
		})
		logger.info('ClientApplication registerListeners success!');
	}

	private onUnexpectedError(err: Error): void {
		// if (err) {

		// 	// take only the message and stack property
		// 	const friendlyError = {
		// 		message: `[uncaught exception in main]: ${err.message}`,
		// 		stack: err.stack
		// 	};

		// 	// handle on client side
		// 	this.windowsMainService?.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
		// }

		logger.error(`[uncaught exception in main]: ${err}`);
		if (err.stack) {
			logger.error(err.stack);
		}
	}

	// private async resolveMachineId(): Promise<string> {

	// 	// We cache the machineId for faster lookups on startup
	// 	// and resolve it only once initially if not cached or we need to replace the macOS iBridge device
	// 	let machineId = this.stateMainService.getItem<string>(machineIdKey);
	// 	if (!machineId || (isMacintosh && machineId === '6c9d2bc8f91b89624add29c0abeae7fb42bf539fa1cdb2e3e57cd668fa9bcead')) {
	// 		machineId = await getMachineId();

	// 		this.stateMainService.setItem(machineIdKey, machineId);
	// 	}

	// 	return machineId;
	// }

	// private setupSharedProcess(machineId: string): { sharedProcess: SharedProcess, sharedProcessReady: Promise<MessagePortClient>, sharedProcessClient: Promise<MessagePortClient> } {
	// 	const sharedProcess = this._register(this.mainInstantiationService.createInstance(SharedProcess, machineId, this.userEnv));

	// 	const sharedProcessClient = (async () => {
	// 		this.logService.trace('Main->SharedProcess#connect');

	// 		const port = await sharedProcess.connect();

	// 		this.logService.trace('Main->SharedProcess#connect: connection established');

	// 		return new MessagePortClient(port, 'main');
	// 	})();

	// 	const sharedProcessReady = (async () => {
	// 		await sharedProcess.whenReady();

	// 		return sharedProcessClient;
	// 	})();

	// 	return { sharedProcess, sharedProcessReady, sharedProcessClient };
	// }
}

