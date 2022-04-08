import { ILightCodeTask, LightCodeTaskCmdType } from 'client/workbench/services/lightCodeService/lightCodeType';
import path = require('path');
import { fork, ChildProcess } from 'child_process'
import LightCodeService, { ITaskConf } from 'client/workbench/services/lightCodeService/lightCodeService';
import Logger from 'client/platform/environment/node/logger';

class LightCodeTasker {

	private _lightCodeTaskConf = LightCodeService.createEmptyTaskConf()

	constructor(lightCodeTaskConf: ITaskConf) {
		this._lightCodeTaskConf = lightCodeTaskConf
	}

	createChildProcess() {
		let jspath = path.join(__dirname, './lightCodeChildProcess.js')
		Logger.INSTANCE.info('jspath', jspath, this._lightCodeTaskConf)
		const child: ChildProcess = fork(jspath, [], { silent: true });
		child.on('message', (m: ILightCodeTask<any>) => {
			Logger.INSTANCE.info('light child_process', m)
			switch (m.cmd) {
				case LightCodeTaskCmdType.C2M_ChildProcessInit:
					child.send({
						cmd: LightCodeTaskCmdType.M2C_LightCodeTask,
						data: this._lightCodeTaskConf
					})
					break
				default:
					break
			}
		});

		child.on('error', function (err: any) {
			console.log(err)
		})

		child.stdout && child.stdout.setEncoding('utf8');
		child.stdout && child.stdout.on('data', function (data) {
			console.log('childdata', data);
		})

		child.on('exit', function (code) {
			console.log("===childexit==" + code)
			// 如果子线程由于异常意外退出， 则重新启动一个
		})
	}
}


export default LightCodeTasker
