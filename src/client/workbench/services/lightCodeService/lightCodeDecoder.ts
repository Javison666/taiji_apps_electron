import {
	commandText,
	// InstructorCategoryType,
	// InstructorCommandType,
	// InstructorPlatformType
} from 'client/workbench/services/lightCodeService/lightCodeType'

const space = ' '
const LightCodeFormatError = 'lightcode format wrong '

class LightCodeDecoder {
	public static readonly INSTANCE = new LightCodeDecoder()

	static getPointAddressFromText(text: string, pt: number) {
		return text.substring(pt, pt + 8)
	}

	test() {
		// test code
		const fs = require('fs')
		let content = fs.readFileSync('/Users/jiweiqing/Desktop/test/test.lc')
		LightCodeDecoder.INSTANCE.decodeCommandText(content.toString())
	}

	decodeCommandText(text: commandText) {
		let pt = 0, singleCommandLength = LightCodeDecoder.getPointAddressFromText(text, pt)
		while (/^[0-9a-f]{8}$/.test(singleCommandLength)) {
			let command_length = parseInt(singleCommandLength, 16), commandStr = ''
			console.log('command_length', command_length)
			pt += 8
			if (text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10001')
			}

			// let lightCodeCommand = {
			// 	platformType: InstructorPlatformType.Full,
			// 	categoryType: InstructorCategoryType.System,
			// 	CommandType: InstructorCommandType.None
			// }
			pt++
			while (/^[0-9a-f_]$/.test(text[pt])) {
				commandStr += text[pt]
				pt++
			}
			if (text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10002')
			}
			pt++
			let payloadLength = command_length - 10 - commandStr.length
			if (payloadLength < 0) {
				throw new Error(LightCodeFormatError + ' 10003')
			}
			let payload = text.substring(pt, pt + payloadLength)
			if (payload.length !== payloadLength) {
				throw new Error(LightCodeFormatError + ' 10004')
			}
			console.log('commandStr:', commandStr, commandStr.length)
			console.log('payload:', payload, payload.length)
			pt += payloadLength + 1
			if (text[pt] !== '\n') {
				break
			} else {
				pt++
				singleCommandLength = LightCodeDecoder.getPointAddressFromText(text, pt)
			}
		}
	}

	decodeConfFile(uri: string) {
	}
}

export default LightCodeDecoder




