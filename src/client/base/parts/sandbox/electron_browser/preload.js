/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check
(function () {
	'use strict';

	const { ipcRenderer, webFrame, contextBridge } = require('electron');

	let seq = 1;
	const seqCallback = {}
	const appChannel = {}
	let selfAppName = ''
	let isPackaged = null
	let userDataPath = ''
	let uuid = ''
	let handlePortMessage = (appName, channelData) => null

	const registetSeq = (cbfn, runfn) => {
		seqCallback[seq] = cbfn
		runfn(seq)
		seq++
	}


	// ipcRenderer.send('client:openDevTools');

	//#region Utilities

	/**
	 * @param {string} channel
	 * @returns {true | never}
	 */
	function validateIPC(channel) {
		if (!channel || !(channel.startsWith('client:') || channel.startsWith('render:'))) {
			throw new Error(`Unsupported event IPC channel '${channel}'`);
		}

		return true;
	}

	/**
	 * @param {string} type
	 * @returns {type is 'uncaughtException'}
	 */
	function validateProcessEventType(type) {
		if (type !== 'uncaughtException') {
			throw new Error(`Unsupported process event '${type}'`);
		}

		return true;
	}

	/**
	 * @param {string} key the name of the process argument to parse
	 * @returns {string | undefined}
	 */
	function parseArgv(key) {
		for (const arg of process.argv) {
			if (arg.indexOf(`--${key}=`) === 0) {
				return arg.split('=')[1];
			}
		}

		return undefined;
	}

	//#endregion

	//#region Resolve Configuration

	/**
	 * //@typedef {import('../common/sandboxTypes').ISandboxConfiguration} ISandboxConfiguration
	 */

	/** //@type {ISandboxConfiguration | undefined} */
	let configuration = undefined;
	let appClientdir = undefined

	/** //@type {Promise<ISandboxConfiguration>} */
	const resolveConfiguration = (async () => {
		appClientdir = parseArgv('client-window-config');
		selfAppName = parseArgv('app-name');
		isPackaged = Boolean(Number(parseArgv('is-packaged')))
		userDataPath = parseArgv('user-data-path')
		uuid = parseArgv('uuid')
		return {
			appRoot: appClientdir
		}

		const windowConfigIpcChannel = parseArgv('client-window-config');
		if (!windowConfigIpcChannel) {
			throw new Error('Preload: did not find expected vscode-window-config in renderer process arguments list.');
		}

		try {
			if (validateIPC(windowConfigIpcChannel)) {

				// Resolve configuration from electron-main
				configuration = await ipcRenderer.invoke(windowConfigIpcChannel);

				// Apply `userEnv` directly
				Object.assign(process.env, configuration.userEnv);

				// Apply zoom level early before even building the
				// window DOM elements to avoid UI flicker. We always
				// have to set the zoom level from within the window
				// because Chrome has it's own way of remembering zoom
				// settings per origin (if vscode-file:// is used) and
				// we want to ensure that the user configuration wins.
				webFrame.setZoomLevel(configuration.zoomLevel ?? 0);

				return configuration;
			}
		} catch (error) {
			throw new Error(`Preload: unable to fetch vscode-window-config: ${error}`);
		}
	})();

	//#endregion

	//#region Resolve Shell Environment

	/**
	 * If VSCode is not run from a terminal, we should resolve additional
	 * shell specific environment from the OS shell to ensure we are seeing
	 * all development related environment variables. We do this from the
	 * main process because it may involve spawning a shell.
	 *
	 * @type {Promise<typeof process.env>}
	 */
	const resolveShellEnv = (async () => {
		// Resolve `userEnv` from configuration and
		// `shellEnv` from the main sides
		const [userEnv, shellEnv] = await Promise.all([
			// (async () => (await resolveConfiguration).userEnv)(),
			// ipcRenderer.invoke('client:fetchShellEnv')
		]);

		return { ...process.env, ...shellEnv, ...userEnv };
	})();

	//#endregion

	//#region Globals Definition

	// #######################################################################
	// ###                                                                 ###
	// ###       !!! DO NOT USE GET/SET PROPERTIES ANYWHERE HERE !!!       ###
	// ###       !!!  UNLESS THE ACCESS IS WITHOUT SIDE EFFECTS  !!!       ###
	// ###       (https://github.com/electron/electron/issues/25516)       ###
	// ###                                                                 ###
	// #######################################################################

	/**
	 * //@type {import('../electron-sandbox/globals')}
	 */
	const globals = {

		bridge: {
			call: () => { }
		},

		/**
		 * A minimal set of methods exposed from Electron's `ipcRenderer`
		 * to support communication to main process.
		 *
		 * //@typedef {import('../electron-sandbox/electronTypes').IpcRenderer} IpcRenderer
		 * @typedef {import('electron').IpcRendererEvent} IpcRendererEvent
		 *
		 *  IpcRenderer
		 */
		app: {
			appName: selfAppName,
			getUuid: () => uuid,
			userDataPath,
			userDataAppPath: userDataPath + '/' + selfAppName,
			isPackaged,
			hideWindow: () => {
				return new Promise(resolve => {
					registetSeq(
						(data) => { resolve(data) },
						(_seq) => {
							ipcRenderer.send('client:hideWindow', selfAppName);
						}
					)
				})
			},
			destroyWindow: (appName) => {
				return new Promise(resolve => {
					registetSeq(
						(data) => { resolve(data) },
						(_seq) => {
							// appName不存在时关闭自身窗口
							ipcRenderer.send('client:destroyWindow', appName);
						}
					)
				})
			},
			require: (moduleName) => {
				return require(moduleName)
			}
		},

		ipcRenderer: {

			// sendProtocal(channel, ...args) {
			// 	return new Promise(resolve => {
			// 		if (validateIPC(channel)) {
			// 			ipcRenderer.send(channel, seq, ...args);
			// 			seqCallback[seq] = () => {
			// 				resolve()
			// 			}
			// 			seq++
			// 		}
			// 	})
			// },

			/**
			 * @param {string} channel
			 * @param {any[]} args
			 */
			send(channel, ...args) {
				if (validateIPC(channel)) {
					ipcRenderer.send(channel, ...args);
				}
			},

			/**
			 * @param {string} channel
			 * @param {any[]} args
			 * @returns {Promise<any> | undefined}
			 */
			invoke(channel, ...args) {
				if (validateIPC(channel)) {
					return ipcRenderer.invoke(channel, ...args);
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 * IpcRenderer
			 */
			on(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.on(channel, listener);
					return this;
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 * IpcRenderer
			 */
			once(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.once(channel, listener);

					return this;
				}
			},

			/**
			 * @param {string} channel
			 * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
			 * IpcRenderer
			 */
			removeListener(channel, listener) {
				if (validateIPC(channel)) {
					ipcRenderer.removeListener(channel, listener);

					return this;
				}
			},

			showErrorBox(title, content) {
				ipcRenderer.send('client:showErrorBox', title, content);
			},

			showMessageBox(option) {
				ipcRenderer.send('client:showMessageBox', option);

			},

			showOpenDialog(options) {
				return new Promise(resolve => {
					registetSeq(
						(data) => { resolve(data) },
						(_seq) => {
							ipcRenderer.send('client:showOpenDialog', _seq, options);
						}
					)
				})
			}
		},

		/**
		 * //@type {import('../electron-sandbox/globals').IpcMessagePort}
		 */
		ipcMessagePort: {

			/**
			 * @param {string} channelRequest
			 * @param {string} channelResponse
			 * @param {string} requestNonce
			 */
			connect(channelRequest, channelResponse, requestNonce) {
				if (validateIPC(channelRequest) && validateIPC(channelResponse)) {
					const responseListener = (/** @type {IpcRendererEvent} */ e, /** @type {string} */ responseNonce) => {
						// validate that the nonce from the response is the same
						// as when requested. and if so, use `postMessage` to
						// send the `MessagePort` safely over, even when context
						// isolation is enabled
						if (requestNonce === responseNonce) {
							ipcRenderer.off(channelResponse, responseListener);
							window.postMessage(requestNonce, '*', e.ports);
						}
					};

					// request message port from main and await result
					ipcRenderer.on(channelResponse, responseListener);
					ipcRenderer.send(channelRequest, requestNonce);
				}
			},

			async connectApp(appName) {
				return new Promise((resolve, reject) => {
					appChannel[appName] = {
						connectCb: () => {
							console.log('[connect-to-app]', appName, 'success!')
							resolve()
						}
					}
					ipcRenderer.send('proxy-apps-channel-request', appName, selfAppName)
					ipcRenderer.once(`proxy-apps-channel-${appName}-error`, () => {
						reject()
					})
				})
			},

			async callApp(appName, data) {
				return new Promise(resolve => {
					if (appChannel[appName] && appChannel[appName].port) {
						registetSeq(
							(cbData) => { resolve(cbData) },
							(_seq) => {
								appChannel[appName].port.postMessage({
									seq: _seq,
									fromApp: selfAppName,
									_type: 'request',
									data
								})
							})

					} else {
						resolve({
							error: `${appName} is not connected`
						})
					}
				})
			},

			async registerHandlePortMessage(fn) {
				handlePortMessage = fn
			}
		},

		/**
		 * Support for subset of methods of Electron's `webFrame` type.
		 *
		 * //@type {import('../electron-sandbox/electronTypes').WebFrame}
		 */
		webFrame: {

			/**
			 * @param {number} level
			 */
			setZoomLevel(level) {
				if (typeof level === 'number') {
					webFrame.setZoomLevel(level);
				}
			}
		},

		/**
		 * Support for a subset of access to node.js global `process`.
		 *
		 * Note: when `sandbox` is enabled, the only properties available
		 * are https://github.com/electron/electron/blob/master/docs/api/process.md#sandbox
		 *
		 * //@typedef {import('../electron-sandbox/globals').ISandboxNodeProcess} ISandboxNodeProcess
		 *
		 * //@type {ISandboxNodeProcess}
		 */
		process: {
			get platform() { return process.platform; },
			get arch() { return process.arch; },
			get env() { return { ...process.env }; },
			get versions() { return process.versions; },
			get type() { return 'renderer'; },
			get execPath() { return process.execPath; },
			get sandboxed() { return process.sandboxed; },

			/**
			 * @returns {string}
			 */
			cwd() {
				return process.env['CLINET_CWD'] || process.execPath.substr(0, process.execPath.lastIndexOf(process.platform === 'win32' ? '\\' : '/'));
			},

			/**
			 * @returns {Promise<typeof process.env>}
			 */
			shellEnv() {
				return resolveShellEnv;
			},

			/**
			 * @returns {Promise<import('electron').ProcessMemoryInfo>}
			 */
			getProcessMemoryInfo() {
				return process.getProcessMemoryInfo();
			},

			/**
			 * @param {string} type
			 * @param {Function} callback
			 * ISandboxNodeProcess
			 */
			on(type, callback) {
				if (validateProcessEventType(type)) {
					// @ts-ignore
					process.on(type, callback);

					return this;
				}
			}
		},

		/**
		 * Some information about the context we are running in.
		 *
		 * //@type {import('../electron-sandbox/globals').ISandboxContext}
		 */
		context: {

			/**
			 * A configuration object made accessible from the main side
			 * to configure the sandbox browser window.
			 *
			 * Note: intentionally not using a getter here because the
			 * actual value will be set after `resolveConfiguration`
			 * has finished.
			 *
			 * ISandboxConfiguration | undefined
			 */
			configuration() {
				return {
					appRoot: appClientdir
				}
				return configuration;
			},

			/**
			 * Allows to await the resolution of the configuration object.
			 *
			 * ISandboxConfiguration
			 */
			async resolveConfiguration() {
				return resolveConfiguration;
			}
		}
	};

	ipcRenderer.on('proxy-apps-channel-event', (event, appName) => {
		if (!appChannel[appName]) {
			return
		}
		const [port] = event.ports
		appChannel[appName].port = port
		appChannel[appName].connectCb()
		// ... register a handler to receive results ...
		port.onmessage = async (event) => {
			const channelData = event.data
			if (channelData._type === 'response') {
				if (channelData.seq && seqCallback[channelData.seq]) {
					seqCallback[channelData.seq](channelData.data)
					delete seqCallback[channelData.seq]
				}
			}
			if (channelData._type === 'request') {
				let res = await handlePortMessage(appName, channelData)
				port.postMessage({
					seq: channelData.seq,
					_type: 'response',
					data: res
				})
			}
		}
	})

	ipcRenderer.on('provide-apps-channel-event', (event, fromAppName) => {
		const [port] = event.ports
		if (appChannel[fromAppName]) {
			appChannel[fromAppName].port = port
		} else {
			appChannel[fromAppName] = {
				port
			}
		}

		port.onmessage = async (event) => {
			const channelData = event.data
			if (channelData._type === 'response') {
				if (channelData.seq && seqCallback[channelData.seq]) {
					seqCallback[channelData.seq](channelData.data)
					delete seqCallback[channelData.seq]
				}
			}
			if (channelData._type === 'request') {
				let res = await handlePortMessage(fromAppName, channelData)
				port.postMessage({
					seq: channelData.seq,
					_type: 'response',
					data: res
				})
			}
		}
	})

	ipcRenderer.on('client:protocal-response', (event, protocal) => {
		if (protocal && protocal.seq && protocal.data && seqCallback[protocal.seq]) {
			seqCallback[protocal.seq](protocal.data)
			delete seqCallback[protocal.seq]
		}
	})

	// Use `contextBridge` APIs to expose globals to VSCode
	// only if context isolation is enabled, otherwise just
	// add to the DOM global.
	if (process && process['contextIsolated']) {
		try {
			contextBridge.exposeInMainWorld('client', globals);
		} catch (error) {
			console.error(error);
		}
	} else {
		// @ts-ignore
		window.client = globals;
	}
}());
