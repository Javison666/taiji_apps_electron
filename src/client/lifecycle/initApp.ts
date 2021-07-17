import { PROTOCOL, Reg_Content } from 'client/env'

const { app } = require('electron');
const path = require('path')
const regedit = require('regedit');
let exe_url = app.getPath('exe');

function setPath(exe_url: string) {
    regedit.putValue({
        reg_content: { // 设置注册表url调用electronApp
            'defaule': {
                value: "RoseBrowser", // 设置点击url的弹出框名字（表现不好）
                type: 'REG_DEFAULT'
            },
            'URL Protocol': {
                value: '',
                type: 'REG_SZ'
            },
            'path': {
                value: `${exe_url}`,
                type: 'REG_SZ'
            }
        },
        'HKLM\\SOFTWARE\\Classes\\electronAPP\\shell\\open\\command': {
            'defaule': {
                value: `"${exe_url}" "$1"`, // 需要唤起的应用程序路劲
                type: 'REG_DEFAULT'
            }
        }
    }, (putErr: any) => {
        // console.log(putErr)
    })
}

export default () => {

    const args = [];
    if (!app.isPackaged) {
        args.push(path.resolve(process.argv[1]));
    }
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args);

    app.allowRendererProcessReuse = true;

    /*隐藏electron创听的菜单栏*/
    // Menu.setApplicationMenu(null);

    //app.disableHardwareAcceleration();

    // 注册表中的路径初始化
    if (exe_url) { // 判断启动url是否正确（用户重新安装，并将安装目录修改）
        regedit.list(Reg_Content, (listErr: any, docData: any) => {
            if (listErr) {
                regedit.createKey(['HKLM\\SOFTWARE\\Classes\\electronAPP\\shell\\open\\command'], (createErr: any) => {
                    if (!createErr) {
                        setPath(exe_url)
                    }
                })
            } else {
                if (docData[Reg_Content].values.path.value !== exe_url) {
                    setPath(exe_url)
                }
            }
        })
    }
}
