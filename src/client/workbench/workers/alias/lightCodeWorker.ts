import LightCodeService from 'client/workbench/services/lightCodeService/lightCodeService'

class LightCodeWebWorker {
	main() {
		onmessage = async (e) => {
			const { data } = e
			LightCodeService.INSTANCE.runTaskConfSync(data)
			postMessage('exit')
		};
	}
}

export default LightCodeWebWorker
