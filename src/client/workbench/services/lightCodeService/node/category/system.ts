import lightCodeSystemType from 'client/workbench/services/lightCodeService/types/lightCodeSystemType';
import {
	ILightCodeCommand,
} from 'client/workbench/services/lightCodeService/types/lightCodeType';
import { execSync } from 'child_process'


class LightCodeCategorySystem {
	public static readonly INSTANCE = new LightCodeCategorySystem()

	run(command: ILightCodeCommand) {
		switch (command.commandType) {
			case lightCodeSystemType.shell:
				const stdout = execSync(command.payload, { cwd: process.cwd(), encoding: 'utf8' })
				break
			default:
				break
		}
	}
}

export default LightCodeCategorySystem
