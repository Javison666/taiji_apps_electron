import { app } from 'electron';
import Logger from 'client/platform/environment/node/logger'
import { ClientApplication } from './app'
import { byteSizeUnit } from 'client/workbench/utils/calc'
import os = require('os')

class EntryMainProcess {

	public static readonly INSTANCE = new EntryMainProcess();

	async main(): Promise<void> {
		try {
			Logger.INSTANCE.init('main')
			this.processHeart()
			await this.startup();
		} catch (error) {
			Logger.INSTANCE.error('EntryMainProcess.main', error.message);
			app.exit(1);
		}
	}

	async processHeart() {
		const freeMemory = os.freemem()
		const totalMemory = os.totalmem()
		setTimeout(() => {
			Logger.INSTANCE.info(`main process_heart: ${(100 - Math.floor(freeMemory / totalMemory * 100))}%, remain ${byteSizeUnit(freeMemory)} / ${byteSizeUnit(totalMemory)}`)
			this.processHeart()
		}, 60000)
	}

	private async startup(): Promise<void> {

		await ClientApplication.INSTANCE.startup()

		// 启动服务
		// let idx = await dialog.showMessageBox({
		// 	title: "帮助",
		// 	message: "是否愿意给苏南大叔买瓶橙汁？",//信息提示框内容
		// 	buttons: ["愿意", "不愿意", "不知道"],//下方显示的按钮
		// 	noLink: true, //win下的样式
		// 	type: "info",//图标类型
		// 	cancelId: 2//点击x号关闭返回值
		// })
	}


}

// Main Startup
EntryMainProcess.INSTANCE.main();
