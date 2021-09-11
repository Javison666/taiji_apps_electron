const log4js = require('log4js');

let loggerFileName = new Date().toLocaleDateString().replace(/\//g, '-') + '_' + new Date().toLocaleTimeString().replace(/:/g, '_')

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

	init(name: string) {
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
					filename: `logs/${String(name).toLocaleLowerCase()}_${loggerFileName}.log`,
					encoding: "utf-8",
					maxLogSize: 1024 * 1024 * 20,
					backups: 30,
					keepFileExt: true,
					compress: true,
				}
			},
			categories: {
				default: { appenders: ["std", "file"], level: "all" },
			}
		});
		this._logger = log4js.getLogger(`${name}:ver`);
	}

	debug(...param: any) {
		this._logger.debug(...param.map(paramFn))
	}

	info(...param: any) {
		this._logger.info(...param.map(paramFn))
	}

	warn(...param: any) {
		this._logger.warn(...param.map(paramFn))
	}

	error(...param: any) {
		this._logger.error(...param.map(paramFn))
	}
}

export default Logger
