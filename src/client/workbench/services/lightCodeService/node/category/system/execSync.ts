import { execSync } from 'child_process'
import LightCode from 'client/workbench/services/lightCodeService/lightCode'
import LightCodeNode from 'client/workbench/services/lightCodeService/node/lightCodeNode'
import { ILightCodeCommandRun, CommandRunStatusType } from 'client/workbench/services/lightCodeService/types/lightCodeType'

export default (command: ILightCodeCommandRun, lightCode: LightCode) => {
	// let status = CommandRunStatusType.Runing
	// let statusDesc = ''

	const payloadData: any[] = LightCodeNode.INSTANCE.decodeCommandPayload(command)
	execSync(payloadData[0], payloadData[1] ? payloadData[1] : {})

	lightCode.emitStepChange({
		...command,
		statusType: CommandRunStatusType.Finished
	})
}

