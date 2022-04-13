import LightCodeNode from 'client/workbench/services/lightCodeService/node/lightCodeNode'
import {
	CommandPayloadDataType,
	CommandRunStatusType,
	commandText,
	ILightCodeCommandBase,
	ILightCodeCommandRun,
	CommandCategoryType,
	CommandPlatformType
} from 'client/workbench/services/lightCodeService/types/lightCodeType'

const space = ' '
const LightCodeFormatError = 'lightcode format wrong '

interface IDecodeLightCodeTextOpt {
	singleCommandRun: (command: ILightCodeCommandRun) => void
}

type StepChangeFn = (command: ILightCodeCommandRun) => void
type StepNumber = number
type StepOut = any

class LightCode {

	private _text = ''
	private _currentStep = 0
	private _stepChangeEvent: Set<StepChangeFn> = new Set()
	private _stepOutMap: Map<StepNumber, { finalUseStep: StepNumber, out: StepOut }> = new Map()

	constructor(text: commandText) {
		this._text = text
		this.init()
	}

	init() {

	}

	registerStepChange(fn: StepChangeFn) {
		this._stepChangeEvent.add(fn)
	}

	unregisterStepChange(fn: StepChangeFn) {
		this._stepChangeEvent.delete(fn)
	}

	emitStepChange(command: ILightCodeCommandRun) {

		// when finished destroy not used stepOut
		if (command.statusType > CommandRunStatusType.Runing) {
			command.relyOutSteps.forEach(relyStep => {
				let stepOutItem = this._stepOutMap.get(relyStep)
				if (stepOutItem && stepOutItem.finalUseStep <= command.step) {
					this._stepOutMap.delete(relyStep)
				}
			})

			if (command.statusType === CommandRunStatusType.Finished) {
				let stepOutItem = this._stepOutMap.get(this._currentStep)
				if (stepOutItem) {
					stepOutItem.out = command.out
				}
			}
		}

		// notify stepChange
		this._stepChangeEvent.forEach(fn => {
			fn(command)
		})
	}

	encodeLightCode(commands: ILightCodeCommandBase[]) {
		let text = ''
		for (let command of commands) {
			let commandStr = ` ${command.commandType}_${command.categoryType}_${command.platformType}_${command.payloadDataType} ${command.payload}`
			text += `${Number(commandStr.length + 8).toString(16)} ${commandStr} ${command.payload}`
		}
		return text
	}

	decodeLightCodeText(opt: IDecodeLightCodeTextOpt) {
		let pt = 0, singleCommandLength = this._text.substring(pt, pt + 8)
		while (/^[0-9a-f]{8}$/.test(singleCommandLength)) {
			let command_length = parseInt(singleCommandLength, 16), commandStr = ''
			pt += 8
			if (this._text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10001')
			}

			let lightCodeCommand: ILightCodeCommandRun = {
				step: this._currentStep,
				statusType: CommandRunStatusType.Ready,
				statusDesc: '',
				platformType: CommandPlatformType.Full,
				categoryType: CommandCategoryType.System,
				commandType: 0,
				relyOutSteps: [],
				payload: '',
				payloadDataType: CommandPayloadDataType.Text,
				out: null
			}
			pt++
			while (/^[0-9a-f_]$/.test(this._text[pt])) {
				commandStr += this._text[pt]
				pt++
			}
			if (this._text[pt] !== space) {
				throw new Error(LightCodeFormatError + ' 10002')
			}

			const commandList: string[] = commandStr.split('_')
			const commandReg = /^[0-9a-f]{1,}$/
			if (commandReg.test(commandList[0])) {
				lightCodeCommand.commandType = parseInt(commandList[0], 16)
			}
			if (commandReg.test(commandList[1])) {
				lightCodeCommand.categoryType = parseInt(commandList[1], 16)
			}
			if (commandReg.test(commandList[2])) {
				lightCodeCommand.platformType = parseInt(commandList[2], 16)
			}
			if (commandReg.test(commandList[3])) {
				lightCodeCommand.payloadDataType = parseInt(commandList[3], 16)
			}
			if (commandReg.test(commandList[4])) {
				// ready for decode add field in the future
				const addtionLength = parseInt(commandList[4], 16)
				// use for global or block vairable
				// const addtionPayload = this._text.substring(pt, pt + addtionLength)
				if (addtionLength > 0) {
					pt += addtionLength + 1
					if (this._text[pt] !== space) {
						throw new Error(LightCodeFormatError + ' 10003')
					}
				}
			}

			pt++
			let payloadLength = command_length - 10 - commandStr.length
			if (payloadLength < 0) {
				throw new Error(LightCodeFormatError + ' 10004')
			}
			let payload = this._text.substring(pt, pt + payloadLength)
			if (payload.length !== payloadLength) {
				throw new Error(LightCodeFormatError + ' 10005')
			}

			lightCodeCommand.payload = payload

			if (
				lightCodeCommand.categoryType === CommandCategoryType.System &&
				lightCodeCommand.commandType === 0
			) {
				// name
			} else {
				// run
				if (opt.singleCommandRun && typeof opt.singleCommandRun === 'function') {
					lightCodeCommand.statusType = CommandRunStatusType.Runing
					this.emitStepChange(lightCodeCommand)
					opt.singleCommandRun(lightCodeCommand)
				}
				this._currentStep++
			}

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
	let content = fs.readFileSync('C:\\Users\\EDZ\\Desktop\\新建文件夹\\test.lc')

	const lightCode = new LightCode(content.toString())
	LightCodeNode.INSTANCE.run(lightCode)
}

export default LightCode



