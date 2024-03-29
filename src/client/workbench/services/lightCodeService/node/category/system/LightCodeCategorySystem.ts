import lightCodeSystemType from 'client/workbench/services/lightCodeService/node/lightCodeSystemType';
import {
	ILightCodeCommandRun,
} from 'client/workbench/services/lightCodeService/types/lightCodeType';
import LightCode from 'client/workbench/services/lightCodeService/lightCode';

import execSync from './execSync'

class LightCodeCategorySystem {
	public static readonly INSTANCE = new LightCodeCategorySystem()

	run(command: ILightCodeCommandRun, lightCode: LightCode) {
		switch (command.commandType) {
			case lightCodeSystemType.shell:
				execSync(command, lightCode)
				break
			default:
				break
		}
	}
}

export default LightCodeCategorySystem
