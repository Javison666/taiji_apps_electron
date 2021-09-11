import { reactive } from 'vue';
import { IFileItem } from 'src/client/workbench/protocals/fileHistoryProtocal'
import { getFilesHistoryListB } from '../bridge/fileHistoryBridge'

interface FileHistoryState {
	list: IFileItem[]
}

export default () => {
	const fileHistoryState: FileHistoryState = reactive({
		list: []
	})

	const updateFilesHistoryList = async () => {
		let rows = await getFilesHistoryListB()
		fileHistoryState.list = rows
	}

	return {
		fileHistoryState,
		updateFilesHistoryList
	}
}
