import { app, session } from 'electron';
import LoginBench from 'client/workbench/main/loginBench'
import logger from 'client/common/log'
import StaticPageResourceServer from 'client/workbench/static_resource/staticPageResourceServer'

class EntryMainProcess {

	public static readonly INSTANCE = new EntryMainProcess();

	main(): void {
		try {
			this.startup();
		} catch (error) {
			console.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {

		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					'Content-Security-Policy': ['default-src \'self\'']
				}
			})
		})

		StaticPageResourceServer.INSTANCE.main()

		logger.info('EntryMainProcess startup success!')
		// 进入登录UI
		new LoginBench().main()

		// 启动服务
		// let idx = await dialog.showMessageBox({
		// 	title: "帮助",
		// 	message: "是否愿意给苏南大叔买瓶橙汁？",//信息提示框内容
		// 	buttons: ["愿意", "不愿意", "不知道"],//下方显示的按钮
		// 	noLink: true, //win下的样式
		// 	type: "info",//图标类型
		// 	cancelId: 2//点击x号关闭返回值
		// })
		// console.log(idx)
	}
}

// Main Startup
EntryMainProcess.INSTANCE.main();
