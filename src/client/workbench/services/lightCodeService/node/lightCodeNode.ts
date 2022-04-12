import LightCode from 'client/workbench/services/lightCodeService/lightCode';
import { ILightCodeCommand, InstructorCategoryType } from 'client/workbench/services/lightCodeService/types/lightCodeType';
import LightCodeCategorySystem from './category/system'


class LightCodeNode {

	public static readonly INSTANCE = new LightCodeNode()

	public run(lightCode: LightCode) {
		lightCode.decodeLightCodeText({
			singleCommandRun: (command: ILightCodeCommand) => {
				switch (command.categoryType) {
					case InstructorCategoryType.System:
						LightCodeCategorySystem.INSTANCE.run(command)
						break
					default:
						break;
				}
			}
		})
	}
}

export default LightCodeNode
