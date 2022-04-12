import LightCodeNode from 'client/workbench/services/lightCodeService/node/lightCodeNode'
import {
	commandText,
	ILightCodeCommand,
	InstructorCategoryType,
	InstructorPlatformType
} from 'client/workbench/services/lightCodeService/types/lightCodeType'

const space = ' '
const LightCodeFormatError = 'lightcode format wrong '

interface IDecodeLightCodeTextOpt {
	singleCommandRun: (command: ILightCodeCommand) => void
}

class LightCode {

	private _text = ''

	constructor(text: commandText) {
		this._text = text
		this.init()
	}

	init() {

	}

	decodeLightCodeText(opt: IDecodeLightCodeTextOpt) {
		let pt = 0, singleCommandLength = this._text.substring(pt, pt + 8)
		while (/^[0-9a-f]{8}$/.test(singleCommandLength)) {
			let command_length = parseInt(singleCommandLength, 16), commandStr = ''
			pt += 8
			if (this._text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10001')
			}

			let lightCodeCommand: ILightCodeCommand = {
				platformType: InstructorPlatformType.Full,
				categoryType: InstructorCategoryType.System,
				commandType: 0,
				payload: ''
			}
			pt++
			while (/^[0-9a-f_]$/.test(this._text[pt])) {
				commandStr += this._text[pt]
				pt++
			}
			if (this._text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10002')
			}
			pt++
			let payloadLength = command_length - 10 - commandStr.length
			if (payloadLength < 0) {
				throw new Error(LightCodeFormatError + ' 10003')
			}
			let payload = this._text.substring(pt, pt + payloadLength)
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

			// run
			opt.singleCommandRun && typeof opt.singleCommandRun === 'function' && opt.singleCommandRun(lightCodeCommand)

			// end check
			pt += payloadLength + 1
			if (this._text[pt] !== '\n') {
				break
			} else {
				pt++
				singleCommandLength = this._text.substring(pt, pt + 8)
			}
		}
	}

	decodeConfFile(uri: string) {
	}
}

// export default LightCode
export const test = () => {
	// test code
	const fs = require('fs')
	// let content = fs.readFileSync('/Users/jiweiqing/Desktop/test/test.lc')
	let content = fs.readFileSync('C:\\Users\\EDZ\\Desktop\\新建文件夹')

	const lightCode = new LightCode(content.toString())
	LightCodeNode.INSTANCE.run(lightCode)
}

export default LightCode



