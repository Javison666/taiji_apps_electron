import nodeStorage from 'client/base/electron/nodeStorage'
import { BookmarkManager, App_Browser_Win_list } from 'client/instance'
import IpcMessageType from 'client/enum/IpcMessageType'

// 初始化winState
export function initBrowserWinState() {
    try {
        if (!nodeStorage.getItem('winState')) {
            nodeStorage.setItem('winState', {})
        }
    } catch (err) { }
}

// 初始化主题模式
export function initBrowserThemeData() {
    try {
        if (!nodeStorage.getItem('browser_theme')) {
            nodeStorage.setItem('browser_theme', 'light')
        }
    } catch (err) { }
}

// 初始化下载数据
export function initBrowserDownloadData() {
    const downloadData = nodeStorage.getItem('downloadData') || {};
    for (let key in downloadData) {
        let item = downloadData[key]
        if (item.download_state == "play") {
            item["download_state"] = "pause";
        }
    }
}

// 初始化书签数据
export function initBrowserBookmakData() {
    const bookmarkData = nodeStorage.getItem('bookmark') || [];
    BookmarkManager.resetData(bookmarkData)

    BookmarkManager.registerTouchUdt(() => {
        App_Browser_Win_list.forEach((item) => {
            item.webContents.send(IpcMessageType.M2R_UpdateWindowBookmark, JSON.stringify({
                bookmarkData: BookmarkManager.data
            }))
        })
    })
}

export default () => {
    // 初始化数据
    initBrowserWinState()
    initBrowserThemeData()
    initBrowserDownloadData()
    initBrowserBookmakData()
}
