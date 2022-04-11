import {
	commandText,
	// InstructorCategoryType,
	// InstructorCommandType,
	// InstructorPlatformType
} from 'client/workbench/services/lightCodeService/lightCodeType'

const space = ' '
const LightCodeFormatError = 'lightcode format wrong 10001'

class LightCodeDecoder {
	public static readonly INSTANCE = new LightCodeDecoder()

	decodeCommandText(text: commandText) {
		if (!/^[0-9a-f]{8}$/.test(text.slice(0, 8)) || text[8] !== space) {
			throw new Error(LightCodeFormatError)
		}

		// let command_length = parseInt(text.slice(0, 8), 16)

		// let lightCodeCommand = {
		// 	platformType: InstructorPlatformType.Full,
		// 	categoryType: InstructorCategoryType.System,
		// 	CommandType: InstructorCommandType.None
		// }

		let pt = 9, commandStr = ''
		while (/^[0-9a-f_]$/.test(text[pt])) {
			commandStr += text[pt]
			pt++
		}

		if (text[pt] !== space) {
			throw new Error(LightCodeFormatError)
		}
		pt++
		console.log('commandStr:', commandStr)
		console.log('payload:', text.slice(pt))
	}

	decodeConfFile(uri: string) {
	}
}

// export default LightCodeDecoder



// test code
const fs = require('fs')
let content = fs.readFileSync('C:\\Users\\EDZ\\Desktop\\新建文件夹\\test.lc')
LightCodeDecoder.INSTANCE.decodeCommandText(content)
