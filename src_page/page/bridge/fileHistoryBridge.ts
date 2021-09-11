import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import { IFileItem, FileHistoryChannelCommand } from 'src/client/workbench/protocals/fileHistoryProtocal'

export async function getFilesHistoryListB(): Promise<IFileItem[]> {
	const rows: IFileItem[] = await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
		channelType: FileHistoryChannelCommand.mainCommand,
		channelCommand: FileHistoryChannelCommand.subCommand.getFilesHistoryList,
	});
	return rows
}


export async function openNewAndAddToFileHistoryB(): Promise<string | null> {
	const res: any = await client.ipcRenderer.showOpenDialog({
		properties: ["openFile"],
	});
	if (!res.canceled) {
		await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
			channelType: FileHistoryChannelCommand.mainCommand,
			channelCommand: FileHistoryChannelCommand.subCommand.addFileHistory,
			reqData: {
				filePath: res.filePaths[0],
			},
		});
		return res.filePaths[0]
	}
	return null
}
