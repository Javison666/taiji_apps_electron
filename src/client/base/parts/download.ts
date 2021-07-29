import nodeStorage from 'client/base/electron/nodeStorage'
import { App_Browser_Win_list } from 'client/instance'
import { Download_Save_Path } from 'client/env'

const uuid = require('node-uuid');

function notice(title = "通知", content = "通知内容", icon = "fad fa-flag-checkered") {
    App_Browser_Win_list.forEach((win: any) => {
        win.webContents.send('notice-msg', title, content, icon);
    });
}

export function download_change() {
    const downloadData = nodeStorage.getItem('downloadData')
    let download_process = 0;
    let download_num = 0;
    for (let key in downloadData) {
        let item = downloadData[key]
        if (item.download_state == "play") {
            download_process += Number((item.download_progress / item.fileSize).toFixed(2));
            download_num++;
        }
    }
    App_Browser_Win_list.forEach((win: any) => {
        let text = (parseFloat((download_process / download_num).toFixed(2)) * 100).toString()
        let index = text.indexOf('.')
        // console.log(download_process+"---"+download_num)
        let process_num = index == -1 ? text + "%" : text.slice(0, index) + "%"
        if (download_num == 0) {
            win.webContents.send('download-manage', "done", 0)
            win.setProgressBar(-1)
        } else {
            let download_num_value = download_num > 99 ? "99+" : download_num;
            win.webContents.send('download-manage', process_num, download_num_value)
            var p = parseFloat((download_process / download_num).toFixed(2))
            if (p === 0) { p = 0; }
            win.setProgressBar(Number(p));
        }
    });

    nodeStorage.setItem('downloadData', downloadData);
}

export const registerSessionDownload = (session: any) => {
    let is_download_user_tip = false;
    session.on('will-download', (e: any, item: any, contents: any) => {
        const downloadData = nodeStorage.getItem('downloadData')
        // var file_name = item.getFilename();
        // var last_len = file_name.lastIndexOf(".");
        // var len = file_name.length;
        // var pathf = file_name.substring(last_len, len).toLowerCase();
        // if(pathf === ".pdf"){
        //     [...App_Browser_Win_list][0].send('open-file',item.getURL(),pathf)
        //     return ;
        // }

        if (is_download_user_tip) {

        } else {
            item.setSavePath(Download_Save_Path + item.getFilename())
        }
        var date = new Date();

        var download_id = uuid.v4()
        downloadData[download_id] = {
            fileName: item.getFilename(),
            fileSize: item.getTotalBytes(),
            download_progress: item.getReceivedBytes(),
            date: date,
            download_path: Download_Save_Path,
            url: item.getURL(),
            item: item,
            download_state: "play"
        }
        notice('下载管理器', "开始下载文件" + item.getFilename(), "fad fa-download");



        item.on('updated', (event: any, state: any) => {
            if (state === 'interrupted') {
                downloadData[download_id]["download_state"] = "pause";
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    downloadData[download_id]["download_state"] = "pause";
                } else {
                    downloadData[download_id]["download_progress"] = item.getReceivedBytes();
                }
            }
            download_change();
        })
        item.once('done', (event: any, state: any) => {
            if (state === 'completed') {
                downloadData[download_id]["download_state"] = "success";
                downloadData[download_id]["download_progress"] = item.getReceivedBytes();
                notice('下载管理器', "文件" + item.getFilename() + "下载完成", "fad fa-check-circle");
            } else {
                // console.log(`Download failed: ${state}`)
                downloadData[download_id]["download_state"] = "state";
                notice('下载管理器', "文件" + item.getFilename() + "下载出错", "fad fa-exclamation-triangle");
            }
            download_change();
        })
        //   let hostWebContents = contents;
        //   if (contents.getType() === 'webview') {
        //     const hostWebContents = contents.hostWebContents;
        //   }
        //   const hostWin = BrowserWindow.fromWebContents(hostWebContents);
    });
}
