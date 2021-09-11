export const FileHistoryChannelCommand = {
	mainCommand: 'fileHistory',
	subCommand: {
		getFilesHistoryList: 'getFilesHistoryList',
		addFileHistory: 'addFileHistory'
	}
}

export interface IAddFileHistoryParams {
	filePath: string,
}

export interface IFileItem {
	file_path: string,
	update_time: string
}
