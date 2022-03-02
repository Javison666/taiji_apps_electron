/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare const enum LoaderEventType {
	LoaderAvailable = 1,

	BeginLoadingScript = 10,
	EndLoadingScriptOK = 11,
	EndLoadingScriptError = 12,

	BeginInvokeFactory = 21,
	EndInvokeFactory = 22,

	NodeBeginEvaluatingScript = 31,
	NodeEndEvaluatingScript = 32,

	NodeBeginNativeRequire = 33,
	NodeEndNativeRequire = 34,

	CachedDataFound = 60,
	CachedDataMissed = 61,
	CachedDataRejected = 62,
	CachedDataCreated = 63,
}

declare class LoaderEvent {
	readonly type: LoaderEventType;
	readonly timestamp: number;
	readonly detail: string;
}

declare const define: {
	(moduleName: string, dependencies: string[], callback: (...args: any[]) => any): any;
	(moduleName: string, dependencies: string[], definition: any): any;
	(moduleName: string, callback: (...args: any[]) => any): any;
	(moduleName: string, definition: any): any;
	(dependencies: string[], callback: (...args: any[]) => any): any;
	(dependencies: string[], definition: any): any;
};

interface NodeRequire {
	/**
	 * @deprecated use `FileAccess.asFileUri()` for node.js contexts or `FileAccess.asBrowserUri` for browser contexts.
	 */
	toUrl(path: string): string;
	(dependencies: string[], callback: (...args: any[]) => any, errorback?: (err: any) => void): any;
	config(data: any): any;
	onError: Function;
	__$__nodeRequire<T>(moduleName: string): T;
	getStats(): ReadonlyArray<LoaderEvent>;
	hasDependencyCycle(): boolean;
	define(amdModuleId: string, dependencies: string[], callback: (...args: any[]) => any): any;
}

declare var require: NodeRequire;


// ************************
interface IClient {
	bridge: {
		// 通知消息
		call: (...param: any) => void
	},
	app: {
		appName: string,
		userDataPath: string,
		userDataAppPath: string,
		isPackaged: boolean,
		hideWindow: () => void,
		destroyWindow: (appName?: string) => void,
		require: (moduleName: string) => any,
		getUuid: () => string,
	},
	ipcMessagePort: {
		connectApp: (appName: string) => Promise<void>,
		callApp: (appName: string, data: any) => Promise<any>,
		registerHandlePortMessage: (fn: (appName: string, data: any) => Promise<any>) => void
	},
	ipcRenderer: {
		// 显示错误消息
		showErrorBox: (title: string, content: string) => void,
		// 显示消息提示框
		showMessageBox: (option: Electron.MessageBoxOptions) => void,
		showOpenDialog: (options: any) => Promise<string | undefined>,
		invoke: (channel: string, ...args: any) => Promise<any>,
		send: (channel: string, ...args: any) => void,
		on: (e: any, ...args: any) => void
	}
}

declare var client: IClient
