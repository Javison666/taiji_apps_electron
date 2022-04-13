import { execSync } from 'child_process'
import LightCode from 'client/workbench/services/lightCodeService/lightCode'
import LightCodeNode from 'client/workbench/services/lightCodeService/node/lightCodeNode'
import { ILightCodeCommand, CommandRunStatusType } from 'client/workbench/services/lightCodeService/types/lightCodeType'

export default (command: ILightCodeCommand, lightCode: LightCode) => {
	const payloadData = LightCodeNode.INSTANCE.decodePayload(command.payload)
	execSync(payloadData[0], payloadData[1] ? payloadData[1] : {})
	command.statusType = CommandRunStatusType.Finished
	command.statusDesc = ''
	lightCode.emitStepChange(command)
}

