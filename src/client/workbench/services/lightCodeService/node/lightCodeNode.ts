import LightCode from 'client/workbench/services/lightCodeService/lightCode';
import { ILightCodeCommand, InstructorCategoryType } from 'client/workbench/services/lightCodeService/types/lightCodeType';
import LightCodeCategorySystem from './category/system/LightCodeCategorySystem'


class LightCodeNode {

	public static readonly INSTANCE = new LightCodeNode()

	public run(lightCode: LightCode) {
		lightCode.decodeLightCodeText({
			singleCommandRun: (command: ILightCodeCommand) => {
				switch (command.categoryType) {
					case InstructorCategoryType.System:
						return LightCodeCategorySystem.INSTANCE.run(command, lightCode)
					default:
						break;
				}
				return
			}
		})
	}

	public decodePayload(payload: string) {
		let params = []
		if (payload.length > 0) {
			console.log('payload', payload)
			params = JSON.parse(payload)
		}
		return params
	}
}

export default LightCodeNode
