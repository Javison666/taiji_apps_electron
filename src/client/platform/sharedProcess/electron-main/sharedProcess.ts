/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, ipcMain, Event as ElectronEvent, IpcMainEvent } from 'electron';
import * as path from 'path'
// import { connect as connectMessagePort } from 'vs/base/parts/ipc/electron-main/ipc.mp';
// import { assertIsDefined } from 'vs/base/common/types';

export class SharedProcess {

	private window: BrowserWindow | undefined = undefined;
	private windowCloseListener: ((event: ElectronEvent) => void) | undefined = undefined;


	constructor() {
		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle

		// Shared process connections from workbench windows
		ipcMain.on('vscode:createSharedProcessMessageChannel', async (e, nonce: string) => this.onWindowConnection(e, nonce));
	}

	private async onWindowConnection(e: IpcMainEvent, nonce: string): Promise<void> {

		await this.whenReady();

		// connect to the shared process window
		// const port = await this.connect();

		// Check back if the requesting window meanwhile closed
		// Since shared process is delayed on startup there is
		// a chance that the window close before the shared process
		// was ready for a connection.

		// send the port back to the requesting window
		// e.sender.postMessage('vscode:createSharedProcessMessageChannelResult', nonce, [port]);
	}

	// private onWillShutdown(): void {
	// 	const window = this.window;
	// 	if (!window) {
	// 		return; // possibly too early before created
	// 	}

	// 	// Signal exit to shared process when shutting down
	// 	if (!window.isDestroyed() && !window.webContents.isDestroyed()) {
	// 		window.webContents.send('vscode:electron-main->shared-process=exit');
	// 	}

	// 	// Shut the shared process down when we are quitting
	// 	//
	// 	// Note: because we veto the window close, we must first remove our veto.
	// 	// Otherwise the application would never quit because the shared process
	// 	// window is refusing to close!
	// 	//
	// 	if (this.windowCloseListener) {
	// 		window.removeListener('close', this.windowCloseListener);
	// 		this.windowCloseListener = undefined;
	// 	}

	// 	// Electron seems to crash on Windows without this setTimeout :|
	// 	setTimeout(() => {
	// 		try {
	// 			window.close();
	// 		} catch (err) {
	// 			// ignore, as electron is already shutting down
	// 		}

	// 		this.window = undefined;
	// 	}, 0);
	// }

	private _whenReady: Promise<void> | undefined = undefined;
	whenReady(): Promise<void> {
		if (!this._whenReady) {
			// Overall signal that the shared process window was loaded and
			// all services within have been created.
			this._whenReady = new Promise<void>(resolve => ipcMain.once('vscode:shared-process->electron-main=init-done', () => {

				resolve();
			}));
		}

		return this._whenReady;
	}

	private _whenIpcReady: Promise<void> | undefined = undefined;
	private get whenIpcReady() {
		if (!this._whenIpcReady) {
			this._whenIpcReady = (async () => {

				// Always wait for first window asking for connection
				// await this.firstWindowConnectionBarrier.wait();

				// Create window for shared process
				this.createWindow();

				// Listeners
				this.registerWindowListeners();

				// Wait for window indicating that IPC connections are accepted
				await new Promise<void>(resolve => ipcMain.once('vscode:shared-process->electron-main=ipc-ready', () => {
					// this.logService.trace('SharedProcess: IPC ready');

					resolve();
				}));
			})();
		}

		return this._whenIpcReady;
	}

	private createWindow(): void {

		// shared process is a hidden window by default
		this.window = new BrowserWindow({
			show: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableWebSQL: false,
				spellcheck: false,
				nativeWindowOpen: true,
				images: false,
				webgl: false,
				disableBlinkFeatures: 'Auxclick' // do NOT change, allows us to identify this window as shared-process in the process explorer
			}
		});

		// Load with config
		this.window.loadURL(path.join(process.cwd(), 'out_client/client/electron-browser/sharedProcess/sharedProcess.html').toString());
	}

	private registerWindowListeners(): void {
		if (!this.window) {
			return;
		}

		// Prevent the window from closing
		this.windowCloseListener = (e: ElectronEvent) => {

			// We never allow to close the shared process unless we get explicitly disposed()
			e.preventDefault();

			// Still hide the window though if visible
			if (this.window?.isVisible()) {
				this.window.hide();
			}
		};

		this.window.on('close', this.windowCloseListener);

		// Crashes & Unresponsive & Failed to load
		// We use `onUnexpectedError` explicitly because the error handler
		// will send the error to the active window to log in devtools too
	}

	async connect(): Promise<void> {

		// Wait for shared process being ready to accept connection
		await this.whenIpcReady;

		// Connect and return message port
	}

	async toggle(): Promise<void> {

		// wait for window to be created
		await this.whenIpcReady;

		if (!this.window) {
			return; // possibly disposed already
		}

		if (this.window.isVisible()) {
			this.window.webContents.closeDevTools();
			this.window.hide();
		} else {
			this.window.show();
			this.window.webContents.openDevTools();
		}
	}

	isVisible(): boolean {
		return this.window?.isVisible() ?? false;
	}
}
