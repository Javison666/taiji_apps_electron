import { ref, onMounted, reactive, toRefs } from 'vue';
import { IFileItem, getFilesHistoryList } from '../bridge/fileHistory'

interface FileHistoryState {
	list: IFileItem[]
}

export default () => {
	const fileHistoryState: FileHistoryState = reactive({
		list: []
	})

	const updateFilesHistoryList = async () => {
		let rows = await getFilesHistoryList()
		fileHistoryState.list = rows
	}

	return {
		fileHistoryState,
		updateFilesHistoryList
	}
}
