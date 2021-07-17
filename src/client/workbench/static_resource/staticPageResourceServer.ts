import logger from 'client/common/log'
import * as express from 'express'
import * as path from 'path'

class StaticPageResourceServer {

	public static readonly INSTANCE = new StaticPageResourceServer();

	private isRunning = false
	public port = 10023

	main(): void {
		try {
			if (this.isRunning) {
				return
			}
			this.startup();
		} catch (error) {
			console.error(error.message);
			// app.exit(1);
		}
	}
	private async startup(): Promise<void> {
		logger.info('StaticPageResourceServer startup success!')
		var app = express();
		//把项目要目录下的public开放出来， 让用户可以访问
		app.use('/', express.static(path.join(process.cwd(), 'out_page')));
		app.all('*', function (req, res, next) {
			res.setHeader('Content-Security-Policy', `default-src 'self'`);
			next();
		})
		app.listen(this.port)

	}

	public getAppNameServerAddr(appName: string) {
		return `http://127.0.0.1:${StaticPageResourceServer.INSTANCE.port}/page/apps/${appName}`
	}
}

export default StaticPageResourceServer
