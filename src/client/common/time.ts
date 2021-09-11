export const sleep = (stamp: number) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(null)
		}, stamp)
	})
}
