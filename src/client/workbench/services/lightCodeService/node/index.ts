import { ILightCodeCommand } from 'client/workbench/services/lightCodeService/types/lightCodeType';

class LightCodeNode {
	public static readonly INSTANCE = new LightCodeNode()

	public runCommand(command: ILightCodeCommand) {
	}
}
