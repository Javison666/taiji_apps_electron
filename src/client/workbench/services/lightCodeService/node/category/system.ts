import lightCodeSystemType from 'client/workbench/services/lightCodeService/types/lightCodeSystemType';
import {
	ILightCodeCommand,
} from 'client/workbench/services/lightCodeService/types/lightCodeType';


class LightCodeCategorySystem {
	public static readonly INSTANCE = new LightCodeCategorySystem()

	run(command: ILightCodeCommand) {
		switch (command.commandType) {
			case lightCodeSystemType.Name:
				break
			default:
				break
		}
	}
}

export default LightCodeCategorySystem
