// export const logUrls = 'https://chat.weierai.com'

// 创建axios实例
// const service = axios.create({
// 	responseType: 'json',
// 	httpsAgent: process.type !== 'renderer' && new https.Agent({
// 		rejectUnauthorized: false
// 	}),
// 	transformResponse: [function (data) {
// 		return data
// 	}],
// 	timeout: 30 * 1000 // 请求超时时间
// })

// export const uploadMiltiFile = (params, config = {}) => request({
// 	url: logUrls + '/api/appupload/instant/uploadMiltiFile',
// 	method: 'POST',
// 	data: params,
// 	...config
//   })

// uploadMiltiFile(uploadData, { headers: uploadData.getHeaders() }).then((res) => {
// 	const datas = JSON.parse(res.data)
// 	if (datas.code !== 1) {
// 		return false
// 	}
// 	logFilePath.forEach((item) => {
// 		fs.stat(item, function (err, stats) {
// 			if (!err && stats.isFile()) {
// 				fs.writeFile(item, ``, function (error) {
// 					if (error) console.writeLog('清空日志文件失败')
// 				})
// 			} else {
// 				console.writeLog('读取文件失败')
// 			}
// 		})
// 	})
// }).catch((error) => {
// 	if (error.message === 'Request body larger than maxBodyLength limit') {
// 		logFilePath.forEach((item) => {
// 			fs.stat(item, function (err, stats) {
// 				if (!err && stats.isFile()) {
// 					fs.writeFile(item, ``, function (errors) {
// 						if (errors) console.writeLog("清空日志文件失败")
// 					})
// 				} else {
// 					console.writeLog('读取文件失败')
// 				}
// 			})
// 		})
// 	}
// 	console.writeLog('上传日志文件失败')
// })
