

export function byteSizeUnit(limit: number) {
	var size = "";
	if (limit < 0.1 * 1024) {
		//小于0.1KB，则转化成B
		size = limit.toFixed(2) + "B"
	} else if (limit < 0.1 * 1024 * 1024) {
		//小于0.1MB，则转化成KB
		size = (limit / 1024).toFixed(2) + "KB"
	} else if (limit < 0.1 * 1024 * 1024 * 1024) {
		//小于0.1GB，则转化成MB
		size = (limit / (1024 * 1024)).toFixed(2) + "MB"
	} else {
		//其他转化成GB
		size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
	}

	var sizeStr = size + "";
	var index = sizeStr.indexOf(".");
	var dou = sizeStr.substr(index + 1, 2)
	if (dou == "00") {
		return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
	}
	return size;
}

