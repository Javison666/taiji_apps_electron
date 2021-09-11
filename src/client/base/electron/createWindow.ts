import nodeStorage from './nodeStorage'
import { AppName } from 'client/env'
import { App_Browser_Win_list } from 'client/instance'

const { BrowserWindow, globalShortcut } = require('electron');
const url = require('url')
const path = require('path')
const PDFWindow = require('electron-pdf-window')

let browserPartition = 1

export function createBrowserWindow(file_path = undefined) {
    let winState: any = {}
    try { winState = nodeStorage.getItem('winState') || {}; } catch (err) { }
    // console.log('global.sharedObject', global)
    let App_Browser_Win = new BrowserWindow({
        title: AppName,
        x: winState.bounds && winState.bounds.x || undefined,
        y: winState.bounds && winState.bounds.y || undefined,
        width: winState.bounds && winState.bounds.width || 1100,
        height: winState.bounds && winState.bounds.height || 720,
        minWidth: 500,
        minHeight: 400,
        /*skipTaskbar: true,*/
        frame: false,
        resizable: true,
        maximizable: true,
        minimizable: true,
        backgroundColor: "#000",
        // autoHideMenuBar:true,
        // transparent: true,
        // icon: "./app/imgs/logo.ico",
        show: true,
        // preload: path.join(__dirname, '/app/index.js'),
        // alwaysOnTop: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            experimentalFeatures: false,
            webviewTag: true,
            nativeWindowOpen: false,
            // offscreen: false,
            plugins: true,
            // partition: 'main'
        }
    });

    // App_Browser_Win.webContents.openDevTools();

    App_Browser_Win.webContents.on("new-window", function (e: any) {
        console.log("新窗口")
    })
    App_Browser_Win_list.add(App_Browser_Win)
    if (winState && winState.isMaximized) {
        App_Browser_Win.maximize();
    }
    var storeWindowState = function () {
        winState.isMaximized = App_Browser_Win.isMaximized();
        if (!winState.isMaximized) {
            winState.bounds = App_Browser_Win.getBounds();
        }
        nodeStorage.setItem('winState', winState);
    };
    ['resize', 'move', 'close'].forEach(function (e: any) {
        App_Browser_Win.on(e, function () {
            storeWindowState();
        });
    });
    // move 很卡
    // ['resize', 'move', 'close'].forEach(function (e) {
    //     App_Browser_Win.on(e, function () {
    //         storeWindowState();
    //     });
    // });


    App_Browser_Win.once('ready-to-show', () => {
        // let hwnd = App_Browser_Win.getNativeWindowHandle()
        // user32.GetSystemMenu(hwnd.readUInt32LE(0), true)
        // App_Browser_Win.show();
        // if (isArgs) {
        //     isArgs = false;
        //     // console.log(process.argv);
        //     var data = handleArgv(process.argv);
        //     if (data == "") { } else if (typeof data == "string") {
        //         var last_len = data.lastIndexOf(".");
        //         var len = data.length;
        //         var pathf = data.substring(last_len, len).toLowerCase();
        //         [...App_Browser_Win_list][0].send('open-file', "file://" + data, "this", pathf)
        //         // console.log("open-file");
        //     } else {
        //         opSet(process.argv)
        //     }
        // }

    })


    // and load the index.html of the app.
    App_Browser_Win.loadURL(url.format({
        pathname: path.join(__dirname, '../../../../app/index.html'),
        protocol: 'file:',
        slashes: true,
        query: {
            partition: browserPartition
        }
    }));

    browserPartition++


    // App_Browser_Win.loadURL('https://im.kwaixiaodian.com/pc');

    // var ses = App_Browser_Win.webContents.session;
    // console.log(ses)
    App_Browser_Win.webContents.send('toggle-theme', nodeStorage.getItem('browser_theme'));


    App_Browser_Win.on("blur", () => {
        try {
            globalShortcut.unregister("ESC")
            globalShortcut.unregister("F11")
            globalShortcut.unregister("F5");
            globalShortcut.unregister("Ctrl+=");
            globalShortcut.unregister("Ctrl+numadd");
            globalShortcut.unregister("Ctrl+-");
            globalShortcut.unregister("Ctrl+0");
        } catch (err) { }
    })
    App_Browser_Win.on("focus", () => {
        try {
            globalShortcut.register("ESC", () => {
                if (App_Browser_Win.isFocused()) {
                    if (App_Browser_Win.isFullScreen()) {
                        App_Browser_Win.setFullScreen(false);
                    }
                }
            })
            globalShortcut.register("F11", () => {
                if (App_Browser_Win.isFocused()) {
                    if (App_Browser_Win.isFullScreen()) {
                        App_Browser_Win.setFullScreen(false);
                    } else {
                        App_Browser_Win.setFullScreen(true);
                    }
                }
            })
            globalShortcut.register("F5", () => {
                if (App_Browser_Win.isFocused()) {
                    App_Browser_Win.webContents.send('reload-page')
                }
            })
            globalShortcut.register("Ctrl+=", () => {
                if (App_Browser_Win.isFocused()) {
                    App_Browser_Win.webContents.send('zoom-in')
                }
            })
            globalShortcut.register("Ctrl+-", () => {
                if (App_Browser_Win.isFocused()) {
                    App_Browser_Win.webContents.send('zoom-out')
                }
            })
            globalShortcut.register("Ctrl+numadd", () => {
                if (App_Browser_Win.isFocused()) {
                    App_Browser_Win.webContents.send('zoom-in')
                }
            })
            globalShortcut.register("Ctrl+0", () => {
                if (App_Browser_Win.isFocused()) {
                    App_Browser_Win.webContents.send('zoom-reset')
                }
            })
        } catch (err) { }
    })

    App_Browser_Win.on('closed', () => {
        App_Browser_Win_list.delete(App_Browser_Win);
    })

}

export function createPdfWindow(path = "") {
    let winState: any = {};
    try { winState = nodeStorage.getItem('winState') || {}; } catch (err) { }
    const pdf_win = new PDFWindow({
        width: winState.bounds && winState.bounds.width || 1100,
        height: winState.bounds && winState.bounds.height || 720,
        title: path
    })
    if (winState && winState.isMaximized) {
        pdf_win.maximize();
    }
    pdf_win.loadURL(path);
}
