import { PROTOCOL } from 'client/env'
import { getUriSearchParams } from 'client/common/uri'

const fs = require("fs")
const { app } = require('electron')

export function opSet(argv: string[]) {
    argv = argv.filter(val => val !== "--allow-file-access-from-files");
    argv = argv.filter(val => val.indexOf("--original-process-start-time=") === -1);

    var file_path = ""

    argv.forEach((str, i, obj) => {
        var last_len = str.lastIndexOf(".");
        var len = str.length;
        var pathf = str.substring(last_len, len).toLowerCase();
        if (pathf !== ".exe") {
            var stat = fs.statSync(str);
            if (stat.isFile()) {
                file_path = str;
            }
        }
    })
    return file_path;
}

export function handleArgv(argv: string[]) {
    const prefix = `${PROTOCOL}:`;
    const offset = app.isPackaged ? 1 : 2;
    const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix));
    return url ? getUriSearchParams(url) : opSet(argv);
}
