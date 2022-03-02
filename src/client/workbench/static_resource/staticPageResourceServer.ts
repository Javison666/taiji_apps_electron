import Logger from 'client/platform/environment/node/logger'
import * as express from 'express'
import * as expressWs from "express-ws";
import { IAppConfiguraiton, IAppType } from 'client/workbench/protocals/commonProtocal'
import { findFreePort } from 'client/base/node/ports'
import path = require('path')
import { sleep } from 'client/common/time';
import { env, EnvType } from 'client/env';
import { fileFromPageResource } from 'client/base/common/network';

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

			// var ffi = client.app.require('ffi-napi')
			// var libm = ffi.Library(fileFromPublicResource('./public/v8_load.dll'), {
			// 	'init': ['int', ['int']]
			// });
			// libm.init(this.port)


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
			const app = <any>express();
			expressWs(app);

			app.ws("/hunter", (ws: any) => {
				ws.on("message", (msg: string) => {
					ws.send('recv from god:' + msg)
				});
			})


			//把项目要目录下的public开放出来， 让用户可以访问
			// Logger.INSTANCE.info('fileFromPageResource', fileFromPageResource(''))
			app.use('/', express.static(path.join(__dirname, '../../../../out_page')));
			// app.use('/', express.static(fileFromPageResource('')));
			app.all('*', function (req: any, res: any, next: any) {
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

		let port = 0
		let appPath = ''

		if (appConf.appType === IAppType.Public_Web) {
			appPath = `${appConf.publicPath ? appConf.publicPath : appConf.appName.toLocaleLowerCase()}/index.html`
		} else {
			appPath = `page/apps/${appConf.appName.toLocaleLowerCase()}/index.html`
		}


		if (env === EnvType.dev) {
			port = 5000
			return `http://127.0.0.1:${port}/${appPath}${appConf.isBackground ? '#background' : ''}${appConf.querys}`
		} else {
			return `${fileFromPageResource(appPath)}${appConf.isBackground ? '#background' : ''}${appConf.querys}`
		}

	}

}

export default StaticPageResourceServer
