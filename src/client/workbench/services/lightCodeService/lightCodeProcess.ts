import { commandText } from 'client/workbench/services/lightCodeService/types/lightCodeType';

class LightCodeProcess {

	private _total = 0
	private _current = 0

	private _isIllegal = false

	constructor(text: commandText) {
		let pt = 0, singleCommandLength = text.substring(pt, pt + 8)
		while (/^[0-9a-f]{8}$/.test(singleCommandLength)) {

		}
	}
}

export default LightCodeProcess
