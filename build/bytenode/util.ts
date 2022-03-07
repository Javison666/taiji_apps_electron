import * as path from 'path'
import * as fs from 'fs'

export function isDirectory(uri: string) {
	let stat = fs.lstatSync(uri)
	return stat.isDirectory()
}

// 获取文件夹内所有某后缀名的文件
export function getDirSuffixFiles(uri: string, suffix: string) {
	if (!isDirectory(uri)) {
		return []
	}
	let result: string[] = []
	let ls = fs.readdirSync(uri)
	for (let i of ls) {
		let itemUri = path.join(uri, i)
		if (isDirectory(itemUri)) {
			result = result.concat(getDirSuffixFiles(itemUri, suffix))
		} else {
			let o = path.parse(itemUri)
			if (o.ext === suffix) {
				result.push(itemUri)
			}
		}
	}
	return result
}
