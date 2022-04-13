import LightCode from 'client/workbench/services/lightCodeService/lightCode';
import { CommandPayloadDataType, ILightCodeCommand, InstructorCategoryType } from 'client/workbench/services/lightCodeService/types/lightCodeType';
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

	public decodeCommandPayload(command: ILightCodeCommand): any {
		let params = ''
		switch (command.payloadDataType) {
			case CommandPayloadDataType.Text:
				break
			case CommandPayloadDataType.Json:
				params = JSON.parse(command.payload)
				break
			default:
				break
		}
		return params
	}

}


export default LightCodeNode
