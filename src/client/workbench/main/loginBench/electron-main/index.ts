import { app } from 'electron';
import DashBench from 'client/workbench/main/dashBench/electron-main/index'
import Logger from 'client/platform/environment/node/logger'
import Background from 'client/entry/electron_main/background';

class LoginBench {
	main(): void {
		try {
			this.startup();
		} catch (error) {
			Logger.INSTANCE.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {
		Logger.INSTANCE.info('LoginBench startup success!')
		this.enterDash()
	}

	private async enterDash(): Promise<void> {
		DashBench.INSTANCE.main()
		Background.INSTANCE.launch()
	}
}

export default LoginBench
