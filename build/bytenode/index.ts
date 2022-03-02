import * as path from 'path';
import * as fs from 'fs'
import { getDirSuffixFiles, isDirectory } from './util';
import { bytenodeFiles } from './param'
const bytenode = require('bytenode')

async function handleBytenodeFileItem(filePath: string) {
	let absolutePath = path.join(process.cwd(), filePath)
	await bytenode.compileFile({
		filename: filePath,
		electron: true
	})
	await fs.unlinkSync(absolutePath)
}

export function handleBytenodeFiles() {
	const result = () => new Promise<void>(async (c, e) => {
		try {
			for (let filePath of bytenodeFiles) {
				let absolutePath = path.join(process.cwd(), filePath)
				if (isDirectory(filePath)) {
					const files = getDirSuffixFiles(absolutePath, '.js').map(i => i.replace(process.cwd() + '\\', ''))
					for (let fileUri of files) {
						await handleBytenodeFileItem(fileUri)
					}
				} else {
					await handleBytenodeFileItem(filePath)
				}
			}
			c()
		} catch (err) {
			e(err)
		}
	})
	result.taskName = `bytenode`;
	return result
}

export default handleBytenodeFiles
// "gulp-tsb": "^4.0.6",
