

class LaunchingApp {
	public static readonly INSTANCE = new LaunchingApp()

	async main(): Promise<void> {
		try {
			this.startup()
		} catch (err) {
		}
	}

	private async startup(): Promise<void> {

	}

}

export default LaunchingApp
