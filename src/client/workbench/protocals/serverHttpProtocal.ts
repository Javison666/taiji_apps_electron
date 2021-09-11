export interface IHttpResponse {
	code: number,
	data: {
		[propertys: string]: any
	}
	msg: string,
	success: boolean
}

export interface IHttpVersionUpdateServerResponse extends IHttpResponse {
	data: {
		versionNo: string,
		versionUrl: string,
		versionMd5: string
	}
}
