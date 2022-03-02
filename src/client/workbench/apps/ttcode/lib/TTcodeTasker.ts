import { ITTcodeTask, TTcodeTaskCmdType } from 'client/workbench/apps/ttcode/lib/TTcodeProtocal';
import path = require('path');
import { fork, ChildProcess } from 'child_process'
import TTCodeService, { ITaskConf } from 'client/workbench/apps/ttcode/lib/TTcodeService';
import Logger from 'client/platform/environment/node/logger';

class TTcodeTasker {

	private _ttcodeTaskConf = TTCodeService.createEmptyTaskConf()

	constructor(ttcodeTaskConf: ITaskConf) {
		this._ttcodeTaskConf = ttcodeTaskConf
	}

	createChildProcess() {
		let jspath = path.join(__dirname, './TTcodeChildProcess.js')
		Logger.INSTANCE.info('jspath', jspath, this._ttcodeTaskConf)
		const child: ChildProcess = fork(jspath, [], { silent: true });
		child.on('message', (m: ITTcodeTask<any>) => {
			Logger.INSTANCE.info('ttcode child_process', m)
			switch (m.cmd) {
				case TTcodeTaskCmdType.C2M_ChildProcessInit:
					child.send({
						cmd: TTcodeTaskCmdType.M2C_TTcodeTask,
						data: this._ttcodeTaskConf
					})
					break
				default:
					break
			}
		});

		child.on('error', function (err: any) {
			console.log(err)
		})

		// console.log('child', child)

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


export default TTcodeTasker
