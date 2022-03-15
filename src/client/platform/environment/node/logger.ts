import path = require('path');
import fs = require('fs')
const log4js = require('log4js');

let loggerFileName = new Date().toLocaleDateString().replace(/\//g, '-')

const paramFn = (i: any) => {
	if (i && i.stack) {
		return i
	}
	if (typeof i === 'string') {
		return i
	} else {
		return JSON.stringify(i)
	}
}

const sendLog = (o: { level: string, data: any }) => {
	try {
		if (process && process.type === 'renderer') {
			let logData = {
				// 线程名
				n: client.app.appName,
				// 启动的唯一标识
				uuid: client.app.getUuid(),
				// 时间
				t: new Date().toLocaleString(),
				// 日志数据
				d: typeof o.data === 'object' ? JSON.stringify(o.data) : o.data,
				// level
				l: o.level
			}
			let url = `http://sprotect.tpddns.cn:29998/w.gif?l=${logData.l}&n=${logData.n}&uuid=${logData.uuid}&t=${Date.now()}&d=${encodeURIComponent(logData.d)}`
			let xhr = new XMLHttpRequest()
			xhr.open('GET', url)
			xhr.send()
		}
	} catch (err) {
		console.error('sendLog', err)
	}
}

class Logger {
	public static readonly INSTANCE = new Logger()

	private _logger: any = null
	private _filename = ''
	private _name = ''

	get path() {
		return path.join(process.cwd(), this._filename)
	}

	private getLog() {
		try {
			fs.accessSync(this.path, fs.constants.F_OK)
		} catch (err) {
			this.init(this._name)
		}
		return this._logger
	}

	init(name: string) {
		this._name = name
		this._filename = `logs/${String(name).toLocaleLowerCase()}_${loggerFileName}.log`
		log4js.configure({
			appenders: {
				std: {
					type: "stdout",
					level: "all",
					// layout: {
					// 	type: "pattern",
					// 	pattern: '%n%[%p %c %m%]',
					// }
				},
				file: {
					type: "file",
					filename: this._filename,
					encoding: "utf-8",
					maxLogSize: 1024 * 1024 * 10,
					backups: 10,
					keepFileExt: true,
					compress: true,
				}
			},
			categories: {
				default: { appenders: ["std", "file"], level: "all" },
			}
		});
		this._logger = log4js.getLogger(`${this._name}:ver`);
	}

	debug(...param: any) {
		const data = param.map(paramFn)
		sendLog({ level: 'debug', data })
		this.getLog().debug(...data)
	}

	info(...param: any) {
		const data = param.map(paramFn)
		sendLog({ level: 'info', data })
		this.getLog().info(...data)
	}

	warn(...param: any) {
		const data = param.map(paramFn)
		sendLog({ level: 'warn', data })
		this.getLog().warn(...data)
	}

	error(...param: any) {
		const data = param.map(paramFn)
		sendLog({ level: 'error', data })
		this.getLog().error(...data)
	}

	// 如果增加sls云端上报, 注意断网时系统错误监听只走本地, 防止走云端继续触发系统错误导致死循环（process.on('uncaughtException|unhandledRejection'）
	local(...param: any) {
		try {
			const data = param.map(paramFn)
			this.getLog().info(...data)
		} catch (err) {
			console.error('loggerError', err)
		}
	}
}

export default Logger
