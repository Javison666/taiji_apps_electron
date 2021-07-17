import { app } from 'electron';
import DashBench from 'client/workbench/main/dashBench'
import logger from 'client/common/log'

class LoginBench {
	main(): void {
		try {
			this.startup();
		} catch (error) {
			console.error(error.message);
			app.exit(1);
		}
	}

	private async startup(): Promise<void> {
		logger.info('LoginBench startup success!')
		this.enterDash()
	}

	private async enterDash(): Promise<void> {
		DashBench.INSTANCE.main()
	}
}

export default LoginBench
