// 此为browser环境下进行通讯

import Logger from 'client/platform/environment/node/logger';
import { IDebuggerTab } from './cdpHandle'

interface IInitOpt {
	onopen: (cdpClient: CdpClient) => void,
	onclose?: () => void,
}

export class CdpClient {

	private _debuggerTab: IDebuggerTab;
	private _ws: WebSocket;
	private _seq = 1;
	private _cdpCallback: any = {}

	get isClosed() {
		return this._ws.readyState === this._ws.CLOSED
	}

	close() {
		this._ws.close()
	}

	constructor(debuggerTab: IDebuggerTab, initOpt: IInitOpt) {
		this._debuggerTab = debuggerTab

		this._ws = new WebSocket(this._debuggerTab.webSocketDebuggerUrl)
		this._ws.onopen = (ev: Event) => {
			initOpt.onopen(this)
		}

		this._ws.onmessage = (ev: any) => {
			try {
				const res = JSON.parse(ev.data)
				if (res && res.id && this._cdpCallback[res.id]) {
					this._cdpCallback[res.id](res)
				}
			} catch (err) {
				console.error(err)
			}
		}

		this._ws.onerror = (ev: Event) => {

		}

		this._ws.onclose = () => {
			initOpt.onclose && initOpt.onclose()
		}
	}

	sendJs(jsStr: string) {
		return new Promise(resolve => {
			try {
				this._cdpCallback[this._seq] = (data: any) => {
					resolve(data)
				}
				const sendData = JSON.stringify({
					id: this._seq,
					method: "Runtime.evaluate",
					params: {
						expression: jsStr
					}
				})
				this._ws.send(sendData)
				Logger.INSTANCE.info(sendData)
				this._seq++
			} catch (err) {
				resolve(null)
				Logger.INSTANCE.error('cdp sendJs err.', err)
			}
		})
	}

	sendPromiseJs(jsStr: string) {
		return new Promise(resolve => {
			try {
				this._cdpCallback[this._seq] = (data: any) => {
					resolve(data)
				}
				this._ws.send(JSON.stringify({
					id: this._seq,
					method: "Runtime.evaluate",
					params: {
						expression: jsStr,
						awaitPromise: true,
						returnByValue: true
					}
				}))
				this._seq++
			} catch (err) {
				resolve(null)
				Logger.INSTANCE.error('cdp sendPromiseJs err.', err)
			}

		})
	}

}

export default CdpClient
