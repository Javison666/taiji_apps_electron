import IpcMessageType from 'client/enum/IpcMessageType'

import { BookmarkManager } from 'client/instance'

const { ipcMain } = require('electron')

export default function () {

    ipcMain.on(IpcMessageType.R2M_AddAndUdtBookmark, (event, data) => {
        if (!data) {
            return BookmarkManager.touchUpdate()
        }
        let { uri, remark, favicon } = JSON.parse(data)
        BookmarkManager.addItem({
            uri,
            remark,
            favicon
        })
    })

    ipcMain.on(IpcMessageType.R2M_DelBookmark, (event, uri: string) => {
        console.log(uri)
        BookmarkManager.delItem(uri)
    })

}
