export interface IFileItem {
	file_path: string,
	update_time: string
}

export async function getFilesHistoryList(): Promise<IFileItem[]> {
	const rows: IFileItem[] = await client.ipcMessagePort.callApp("Shared_Process", {
		channelType: "fileHistory",
		channelCommond: "getFilesHistoryList",
	});
	return rows
}


export async function openNewAndAddToFileHistory(): Promise<string | null> {
	const res: any = await client.ipcRenderer.showOpenDialog({
		properties: ["openFile"],
	});
	if (!res.canceled) {
		await client.ipcMessagePort.callApp("Shared_Process", {
			channelType: "fileHistory",
			channelCommond: "addFileHistory",
			reqData: {
				filePath: res.filePaths[0],
			},
		});
		return res.filePaths[0]
	}
	return null
}
