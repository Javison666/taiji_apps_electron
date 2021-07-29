export { };
// const { ipcMain, app, BrowserWindow, Menu, MenuItem, Tray, dialog, nativeImage, globalShortcut, session } = require('electron');
import nodeStorage from 'client/base/electron/nodeStorage'
import { createBrowserWindow, createPdfWindow } from 'client/base/electron/createWindow'
import { App_Browser_Win_list } from 'client/instance'
import { registerSessionDownload } from 'client/base/parts/download'
import { handleArgv, opSet } from './utils'

const { ipcMain, app, session } = require('electron');

export default () => {

    app.on('session-created', (session: any) => {
        registerSessionDownload(session)
    });

    ipcMain.on('synchronous-message', function (event: any, arg: string) {
        var jsonData = JSON.parse(arg)

        switch (jsonData.type) {
            case "theme":
                App_Browser_Win_list.forEach((item: any) => {
                    item.webContents.send('toggle-theme', jsonData.data);
                });
                nodeStorage.setItem('browser_theme', jsonData.data);
                break
            case "new-window":
                createBrowserWindow();
                break
            case "load-theme":
                event.sender.send('toggle-theme', nodeStorage.getItem('browser_theme'));
                break
            case "open-pdf":
                createPdfWindow(jsonData.path);
                break
            case "msg-info":
                break
            case "":
                break
            default:
        }

        event.returnValue = "ok"
    })

    ipcMain.on('on-save-image', function (event: any) {
        event.sender.send('on-save-image', app.getPath("pictures"))
    })

    // 防止两次启动程序
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
    } else {
        app.on('second-instance', (event: any, argv: string[], workingDirectory: string) => {
            if (process.platform === 'win32') {
                // App_Browser_Win_list.forEach((item, i, obj) => {
                //     item.webContents.send('DEBUG', argv.toString())
                // })
                var data = handleArgv(argv);
                // App_Browser_Win_list[0].send('open-file', "file://"+str)
                if (data == "") { createBrowserWindow() } else if (typeof data == "string") {
                    var last_len = data.lastIndexOf(".");
                    var len = data.length;
                    var pathf = data.substring(last_len, len).toLowerCase();
                    // [...App_Browser_Win_list][0].send('open-file', "file://" + data, "", pathf)
                    if (pathf === ".pdf") {
                        createPdfWindow(data)
                    } else if (pathf === ".html") {
                        [...App_Browser_Win_list][0].webContents.send('open-file', "file://" + data, "", pathf)
                    } else {
                        createBrowserWindow()
                    }
                } else {
                    opSet(argv)
                }

            }
        })
    }

    app.on('ready', () => {
        // 修改存取下列 URL 時使用的 User Agent。
        const filter = {
            //   urls: ['https://*.github.com/*', '*://electron.github.io']
            urls: ['*://*.kwaixiaodian.com/*']
        }
        // ***************************
        session.defaultSession.webRequest.onHeadersReceived(function (details, callback) {
            if (!details || !details.responseHeaders) {
                return callback({ cancel: false });
            }
            if (!details.responseHeaders["content-security-policy-report-only"] && !details.responseHeaders["content-security-policy"]) {
                return callback({ cancel: false });
            }
            delete details.responseHeaders["content-security-policy-report-only"];
            delete details.responseHeaders["content-security-policy"];
            callback({ cancel: false, responseHeaders: details.responseHeaders });
        });

        session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            if (details.requestHeaders['RRRReferer']) {
                details.requestHeaders['Referer'] = details.requestHeaders['RRRReferer']
                delete details.requestHeaders["RRRReferer"];
            }
            if (details.requestHeaders['OOOOrigin']) {
                details.requestHeaders['Origin'] = details.requestHeaders['OOOOrigin']
                delete details.requestHeaders["Origin"];
            }
            callback({ requestHeaders: details.requestHeaders });
        })
        // console.log("ready");
        // createBrowserWindow(true)
        // console.log(process.argv);
        // BrowserWindow.addExtension("./app/Extensions/jsonview/0.0.32.3_0");

        // console.log(BrowserWindow.getExtensions());
        var data = handleArgv(process.argv);
        if (data == "") {
            createBrowserWindow()
        } else if (typeof data == "string") {
            var last_len = data.lastIndexOf(".");
            var len = data.length;
            var pathf = data.substring(last_len, len).toLowerCase();
            if (pathf === ".pdf") {
                createPdfWindow(data);
            } else if (pathf === ".html") {
                createBrowserWindow();
                setTimeout(() => { [...App_Browser_Win_list][0].webContents.send('open-file', "file://" + data, "this", pathf) }, 1000);
            } else {
                createBrowserWindow()
            }
        } else {
            opSet(process.argv)
        }
    })

    app.on('window-all-closed', () => { app.quit(); })

    app.on('activate', () => { })

}
