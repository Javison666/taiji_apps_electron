import LightCodeService from 'client/workbench/services/lightCodeService/lightCodeService'

class LightCodeWebWorker {
	public static readonly INSTANCE = new LightCodeWebWorker()
	main() {
		onmessage = async (e) => {
			const { data } = e
			LightCodeService.INSTANCE.runTaskConfSync(data)
			postMessage('exit')
		};
	}
}

export async function main(): Promise<void> {
	await LightCodeWebWorker.INSTANCE.main();
}

