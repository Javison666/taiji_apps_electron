import Logger from 'client/platform/environment/node/logger'
import * as express from 'express'
import * as expressWs from "express-ws";
import { IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import { findFreePort } from 'client/base/node/ports'
import path = require('path')
import { sleep } from 'client/common/time';

class StaticPageResourceServer {

	public static readonly INSTANCE = new StaticPageResourceServer();

	private isRunning = false
	private _port = 19666
	public port = 19666

	async main(): Promise<void> {
		try {
			if (this.isRunning) {
				return
			}
			await this.startup();
		} catch (error) {
			Logger.INSTANCE.error('StaticPageResourceServer.main error:', error.message);
			// app.exit(1);
		}
	}
	private async startup(): Promise<void> {
		try {
			this.port = await findFreePort(this._port, 60000, 10000)
			if (!this.port) {
				this._port++
				await sleep(200)
				return this.startup()
			}
			Logger.INSTANCE.info(`StaticPageResourceServer[:${this.port}] startup success!`)
			const app = express();
			expressWs(app);

			//把项目要目录下的public开放出来， 让用户可以访问
			// Logger.INSTANCE.info('fileFromPageResource', fileFromPageResource(''))
			app.use('/', express.static(path.join(__dirname, '../../../../out_page')));
			// app.use('/', express.static(fileFromPageResource('')));
			app.all('*', function (req, res, next) {
				// res.setHeader('Content-Security-Policy', `default-src 'self' https://at.alicdn.com 'unsafe-inline' 'unsafe-eval'; style-src-elem '*'`);
				// res.setHeader('Content-Security-Policy', `*`);
				next();
			})
			app.listen(this.port)
		} catch (err) {
			Logger.INSTANCE.error('StaticPageResourceServer startup err.', err)
		}

	}

	public getAppNameServerAddr(appConf: IAppConfiguraiton) {
		if (!appConf.querys) {
			appConf.querys = ''
		}
		switch (appConf.appType) {
			case IAppType.Share_Web:
				return `http://127.0.0.1:${StaticPageResourceServer.INSTANCE.port}/page/apps/${appConf.appName.toLocaleLowerCase()}${appConf.querys}`
			case IAppType.Public_Web:
				return `http://127.0.0.1:${StaticPageResourceServer.INSTANCE.port}/${appConf.publicPath ? appConf.publicPath : appConf.appName.toLocaleLowerCase()}${appConf.querys}`
			case IAppType.Client_Web:
				return `http://127.0.0.1:${StaticPageResourceServer.INSTANCE.port}/page/apps/${appConf.appName.toLocaleLowerCase()}${appConf.querys}`
			default:
				return ''
		}
	}

}

export default StaticPageResourceServer
