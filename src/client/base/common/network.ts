/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'client/base/common/uri';
import * as platform from 'client/base/common/platform';
import * as path from 'path'
import { app, ipcRenderer } from 'electron'
import { OutClientDir } from 'client/env'
import * as fs from 'fs'

export namespace Schemas {

	/**
	 * A schema that is used for models that exist in memory
	 * only and that have no correspondence on a server or such.
	 */
	export const inMemory = 'inmemory';

	/**
	 * A schema that is used for setting files
	 */
	export const client = 'client';

	/**
	 * A schema that is used for internal private files
	 */
	export const internal = 'private';

	/**
	 * A walk-through document.
	 */
	export const walkThrough = 'walkThrough';

	/**
	 * An embedded code snippet.
	 */
	export const walkThroughSnippet = 'walkThroughSnippet';

	export const http = 'http';

	export const https = 'https';

	export const file = 'file';

	export const mailto = 'mailto';

	export const untitled = 'untitled';

	export const data = 'data';

	export const command = 'command';

	export const userData = 'client-userdata';

	export const webviewPanel = 'webview-panel';

	/**
	 * Scheme used for loading the wrapper html and script in webviews.
	 */
	export const clientWebview = 'client-webview';

	/**
	 * Scheme used for extension pages
	 */
	export const extension = 'extension';

	/**
	 * Scheme used as a replacement of `file` scheme to load
	 * files with our custom protocol handler (desktop only).
	 */
	export const clientFileResource = 'client-file';

	/**
	 * Scheme used for temporary resources
	 */
	export const tmp = 'tmp';
}

class RemoteAuthoritiesImpl {
	private readonly _hosts: { [authority: string]: string | undefined; } = Object.create(null);
	private readonly _ports: { [authority: string]: number | undefined; } = Object.create(null);
	private readonly _connectionTokens: { [authority: string]: string | undefined; } = Object.create(null);
	private _preferredWebSchema: 'http' | 'https' = 'http';
	private _delegate: ((uri: URI) => URI) | null = null;

	setPreferredWebSchema(schema: 'http' | 'https') {
		this._preferredWebSchema = schema;
	}

	setDelegate(delegate: (uri: URI) => URI): void {
		this._delegate = delegate;
	}

	set(authority: string, host: string, port: number): void {
		this._hosts[authority] = host;
		this._ports[authority] = port;
	}

	setConnectionToken(authority: string, connectionToken: string): void {
		this._connectionTokens[authority] = connectionToken;
	}

	rewrite(uri: URI): URI {
		if (this._delegate) {
			return this._delegate(uri);
		}
		const authority = uri.authority;
		let host = this._hosts[authority];
		if (host && host.indexOf(':') !== -1) {
			host = `[${host}]`;
		}
		const port = this._ports[authority];
		const connectionToken = this._connectionTokens[authority];
		let query = `path=${encodeURIComponent(uri.path)}`;
		if (typeof connectionToken === 'string') {
			query += `&tkn=${encodeURIComponent(connectionToken)}`;
		}
		return URI.from({
			scheme: this._preferredWebSchema,
			authority: `${host}:${port}`,
			path: `/client-remote-resource`,
			query
		});
	}
}

export const RemoteAuthorities = new RemoteAuthoritiesImpl();

class FileAccessImpl {

	private readonly FALLBACK_AUTHORITY = 'client-app';

	/**
	 * Returns a URI to use in contexts where the browser is responsible
	 * for loading (e.g. fetch()) or when used within the DOM.
	 *
	 * **Note:** use `dom.ts#asCSSUrl` whenever the URL is to be used in CSS context.
	 */
	asBrowserUri(uri: URI): URI;
	asBrowserUri(moduleId: string, moduleIdToUrl: { toUrl(moduleId: string): string }, __forceCodeFileUri?: boolean): URI;
	asBrowserUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }, __forceCodeFileUri?: boolean): URI {
		const uri = this.toUri(uriOrModule, moduleIdToUrl);

		let convertToVSCodeFileResource = false;

		// Only convert the URI if we are in a native context and it has `file:` scheme
		// and we have explicitly enabled the conversion (sandbox, or VSCODE_BROWSER_CODE_LOADING)
		if (platform.isNative && (__forceCodeFileUri || platform.isPreferringBrowserCodeLoad) && uri.scheme === Schemas.file) {
			convertToVSCodeFileResource = true;
		}

		// Also convert `file:` URIs in the web worker extension host (running in desktop) case
		if (uri.scheme === Schemas.file && typeof platform.globals.importScripts === 'function' && platform.globals.origin === 'vscode-file://vscode-app') {
			convertToVSCodeFileResource = true;
		}

		if (convertToVSCodeFileResource) {
			return uri.with({
				scheme: Schemas.clientFileResource,
				// We need to provide an authority here so that it can serve
				// as origin for network and loading matters in chromium.
				// If the URI is not coming with an authority already, we
				// add our own
				authority: uri.authority || this.FALLBACK_AUTHORITY,
				query: null,
				fragment: null
			});
		}

		return uri;
	}

	/**
	 * Returns the `file` URI to use in contexts where node.js
	 * is responsible for loading.
	 */
	asFileUri(uri: URI): URI;
	asFileUri(moduleId: string, moduleIdToUrl: { toUrl(moduleId: string): string }): URI;
	asFileUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }): URI {
		const uri = this.toUri(uriOrModule, moduleIdToUrl);

		// Only convert the URI if it is `vscode-file:` scheme
		if (uri.scheme === Schemas.clientFileResource) {
			return uri.with({
				scheme: Schemas.file,
				// Only preserve the `authority` if it is different from
				// our fallback authority. This ensures we properly preserve
				// Windows UNC paths that come with their own authority.
				authority: uri.authority !== this.FALLBACK_AUTHORITY ? uri.authority : null,
				query: null,
				fragment: null
			});
		}

		return uri;
	}

	private toUri(uriOrModule: URI | string, moduleIdToUrl?: { toUrl(moduleId: string): string }): URI {
		if (URI.isUri(uriOrModule)) {
			return uriOrModule;
		}

		return URI.parse(moduleIdToUrl!.toUrl(uriOrModule));
	}
}

export const FileAccess = new FileAccessImpl();

// 适配编译前后返回当前是否为打包环境, 适配main以及render线程
export const isPackagedCommon = () => {
	return (app && app.isPackaged) || (!app && client && client.app && client.app.isPackaged)
}

// 适配编译前后返回out_page目录下的内容, 适配main以及render线程
export const fileFromPageResource = (filePath: string) => {
	if (isPackagedCommon()) {
		return path.join(`./out_page/${filePath}`)
	} else {
		return path.join(process.cwd(), path.join(`./out_page/${filePath}`))
	}
}

// 适配编译前后环境返回src文件夹的目录, 适配main以及render线程
export const fileFromClientResource = (filePath: string) => {
	if (isPackagedCommon()) {
		return path.join(`./${OutClientDir}/${filePath}`)
	} else {
		return path.join(process.cwd(), path.join(`./${OutClientDir}/${filePath}`))
	}
}

// 适配编译前后环境返回public的目录, 适配main以及render线程
export const fileFromPublicResource = (filePath: string) => {
	if (isPackagedCommon()) {
		return path.join(process.cwd(), 'resources', filePath)
	} else {
		return path.join(process.cwd(), filePath)
	}
}

// 返回userData目录, 适配main以及render线程
export const fileFromUserDataCommon = (filePath: string) => {
	if (app) {
		return path.join(app.getPath('userData'), filePath)
	} else {
		return path.join(client.app.userDataPath, filePath)
	}

}

// 若不存在，直接创建空白文件
export const fileCreateIfNotExisted = (filePath: string) => {
	if (!fs.existsSync(filePath)) {
		let dir = path.join(filePath, '../')
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		fs.openSync(filePath, 'w');
	};
}

export const getAppDataDirPath = () => ipcRenderer.invoke('client:getAppDataDirPath')

export const getVersionCommon = async () => {
	if (app) {
		return app.getVersion()
	} else {
		let version = await ipcRenderer.invoke('client:getClientVersion')
		return version
	}
}
