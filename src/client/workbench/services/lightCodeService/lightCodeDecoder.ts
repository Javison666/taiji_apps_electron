import {
	commandText,
	InstructorCategoryType,
	InstructorCommandType,
	InstructorPlatformType
} from 'client/workbench/services/lightCodeService/lightCodeType'

const space = ' '

class LightCodeDecoder {
	public static readonly INSTANCE = new LightCodeDecoder()

	decodeCommandText(text: commandText) {
		if (!/^[0-9a-f]{8}$/.test(text.slice(0, 8)) || text[8] !== space) {
			throw new Error('lightcode format wrong 10001')
		}

		let command_length = parseInt(text.slice(0, 8), 16)

		let lightCodeCommand = {
			platformType: InstructorPlatformType.Full,
			categoryType: InstructorCategoryType.System,
			CommandType: InstructorCommandType.None
		}

		let pt = 9, commandStr = ''
		while (/^[0-9a-f_]$/.test(text[pt])) {
			commandStr += text[pt]
			pt++
		}
	}

	decodeConfFile(uri: string) {
	}
}

export default LightCodeDecoder
