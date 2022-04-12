import InstructorSystemCommandType from 'client/workbench/services/lightCodeService/types/lightCodeSystemType'
import {
	commandText,
	ILightCodeCommand,
	InstructorCategoryType,
	InstructorPlatformType
} from 'client/workbench/services/lightCodeService/types/lightCodeType'

const space = ' '
const LightCodeFormatError = 'lightcode format wrong '

class LightCodeDecoder {
	public static readonly INSTANCE = new LightCodeDecoder()

	test() {
		// test code
		const fs = require('fs')
		// let content = fs.readFileSync('/Users/jiweiqing/Desktop/test/test.lc')
		let content = fs.readFileSync('C:\\Users\\EDZ\\Desktop\\新建文件夹')

		LightCodeDecoder.INSTANCE.decodeLightCodeText(content.toString())
	}

	decodeLightCodeText(text: commandText) {
		let pt = 0, singleCommandLength = text.substring(pt, pt + 8)
		while (/^[0-9a-f]{8}$/.test(singleCommandLength)) {
			let command_length = parseInt(singleCommandLength, 16), commandStr = ''
			console.log('command_length', command_length)
			pt += 8
			if (text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10001')
			}

			let lightCodeCommand: ILightCodeCommand = {
				platformType: InstructorPlatformType.Full,
				categoryType: InstructorCategoryType.System,
				commandType: InstructorSystemCommandType.None,
				payload: ''
			}
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

			const commandList: string[] = commandStr.split('_')
			if (/^[0-9a-f]{1,}$/.test(commandList[0])) {
				lightCodeCommand.commandType = parseInt(commandList[0], 16)
			}
			if (/^[0-9a-f]{1,}$/.test(commandList[1])) {
				lightCodeCommand.categoryType = parseInt(commandList[1], 16)
			}
			if (/^[0-9a-f]{1,}$/.test(commandList[2])) {
				lightCodeCommand.platformType = parseInt(commandList[2], 16)
			}
			lightCodeCommand.payload = payload

			console.log('lightCodeCommand', lightCodeCommand)

			// end check
			pt += payloadLength + 1
			if (text[pt] !== '\n') {
				break
			} else {
				pt++
				singleCommandLength = text.substring(pt, pt + 8)
			}
		}
	}

	decodeConfFile(uri: string) {
	}
}

export default LightCodeDecoder




