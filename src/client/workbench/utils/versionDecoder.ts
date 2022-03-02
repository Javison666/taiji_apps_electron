class VersionDecoder {

	private _verArr: number[] = []

	constructor(ver: any) {
		if (typeof ver !== 'string') {
			throw Error('VersionDecoder: ver is not string type.')
		}
		if (!/^\d+(\.\d+)*$/.test(ver)) {
			throw Error('VersionDecoder: ver is not available.')
		}
		this._verArr = ver.split('.').map(i => parseInt(i))
	}

	public static getBinaryStr(ver: VersionDecoder) {
		return ver._verArr.map(i => Number(i).toString(2).padStart(32, '0')).join('')
	}

	public static compareVer(ver1: VersionDecoder, ver2: VersionDecoder) {
		let len = Math.max(ver1._verArr.length, ver2._verArr.length), bLen = len * 32
		let v1 = VersionDecoder.getBinaryStr(ver1).padEnd(bLen, '0')
		let v2 = VersionDecoder.getBinaryStr(ver2).padEnd(bLen, '0')
		for (let i = 0; i < bLen; i++) {
			if (v1[i] > v2[i]) {
				return 1
			} else if (v1[i] < v2[i]) {
				return -1
			}
		}
		return 0
	}
}

export default VersionDecoder
