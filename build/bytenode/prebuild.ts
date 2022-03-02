import * as path from 'path';
import * as fs from 'fs'
import { app } from 'electron'
import { getDirSuffixFiles, isDirectory } from './util';
import { bytenodeFiles } from './param';
const bytenode = require('bytenode')

// const baseUri = 'E:\\dev\\github\\client-tool'
const baseUri = process.cwd()

async function handleBytenodeFileItem(filePath: string) {
	console.log('filePath', filePath)
	let absolutePath = path.join(baseUri, filePath)
	await bytenode.compileFile({
		filename: absolutePath,
		electron: false
	})
	await fs.unlinkSync(absolutePath)
}

// export function handleBytenodeFiles() {
// 	const result = () => new Promise<void>(async (c, e) => {
// 		try {
// 			for (let filePath of bytenodeFiles) {
// 				let absolutePath = path.join(process.cwd(), filePath)
// 				if (isDirectory(filePath)) {
// 					const files = getDirSuffixFiles(absolutePath, '.js').map(i => i.replace(process.cwd() + '\\', ''))
// 					for (let fileUri of files) {
// 						await handleBytenodeFileItem(fileUri)
// 					}
// 				} else {
// 					await handleBytenodeFileItem(filePath)
// 				}
// 			}
// 			c()
// 		} catch (err) {
// 			e(err)
// 		}
// 	})
// 	result.taskName = `bytenode`;
// 	return result
// }

async function handleBytenodeFiles() {
	console.log('bytenode start.')
	try {
		for (let filePath of bytenodeFiles) {
			let absolutePath = path.join(baseUri, filePath)
			if (isDirectory(absolutePath)) {
				const files = getDirSuffixFiles(absolutePath, '.js').map(i => i.replace(baseUri + '\\', ''))
				for (let fileUri of files) {
					await handleBytenodeFileItem(fileUri)
				}
			} else {
				await handleBytenodeFileItem(filePath)
			}
		}
	} catch (err) {
		console.error(err)
	}
	console.log('bytenode success.')
	if (app) {
		app.exit()
	}
}

handleBytenodeFiles()

