import LightCode from 'client/workbench/services/lightCodeService/lightCode';
import { CommandPayloadDataType, ILightCodeCommandRun, CommandCategoryType, CommandPlatformType, CommandRunStatusType } from 'client/workbench/services/lightCodeService/types/lightCodeType';
import LightCodeCategorySystem from './category/system/LightCodeCategorySystem'


class LightCodeNode {

	public static readonly INSTANCE = new LightCodeNode()

	public run(lightCode: LightCode) {
		lightCode.decodeLightCodeText({
			singleCommandRun: (command: ILightCodeCommandRun) => {
				// platform check
				if (
					(command.platformType === CommandPlatformType.Windows && process.platform !== 'win32') ||
					(command.platformType === CommandPlatformType.Mac && process.platform !== 'darwin') ||
					(command.platformType === CommandPlatformType.Linux && process.platform !== 'linux')
				) {
					return lightCode.emitStepChange({
						...command,
						statusType: CommandRunStatusType.Skip,
						statusDesc: 'no use to current platform'
					})
				}

				switch (command.categoryType) {
					case CommandCategoryType.System:
						return LightCodeCategorySystem.INSTANCE.run(command, lightCode)
					default:
						break;
				}
				return
			}
		})
	}

	public decodeCommandPayload(command: ILightCodeCommandRun): any {
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
