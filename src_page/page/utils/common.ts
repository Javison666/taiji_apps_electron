// import * as path from 'path'

export const getFileNameFromPath = (filePath: string) => {
	var pos1 = filePath.lastIndexOf('/');
	var pos2 = filePath.lastIndexOf('\\');
	var pos = Math.max(pos1, pos2);
	if (pos < 0) {
		return filePath;
	}
	else {
		return filePath.substring(pos + 1);
	}
}
