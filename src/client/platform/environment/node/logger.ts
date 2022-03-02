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
		this.getLog().debug(...param.map(paramFn))
	}

	info(...param: any) {
		this.getLog().info(...param.map(paramFn))
	}

	warn(...param: any) {
		this.getLog().warn(...param.map(paramFn))
	}

	error(...param: any) {
		this.getLog().error(...param.map(paramFn))
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
