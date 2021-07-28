const {
    app
} = require('electron');

export const OutClientDir = 'out_client'

export const AppName = 'Chrome'

export const AppName_en = "Chrome"

export const Download_Save_Path = app.getPath("downloads") + "\\" + AppName + "下载\\";

export const PROTOCOL = 'browser';

export const Reg_Content = 'XWLM\\SOFTWARE\\Classes\\' + 'XwChrome'
