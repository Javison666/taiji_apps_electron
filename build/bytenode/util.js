"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirSuffixFiles = exports.isDirectory = void 0;
const path = require("path");
const fs = require("fs");
function isDirectory(uri) {
    let stat = fs.lstatSync(uri);
    return stat.isDirectory();
}
exports.isDirectory = isDirectory;
// 获取文件夹内所有某后缀名的文件
function getDirSuffixFiles(uri, suffix) {
    if (!isDirectory(uri)) {
        return [];
    }
    let result = [];
    let ls = fs.readdirSync(uri);
    for (let i of ls) {
        let itemUri = path.join(uri, i);
        if (isDirectory(itemUri)) {
            result = result.concat(getDirSuffixFiles(itemUri, suffix));
        }
        else {
            let o = path.parse(itemUri);
            if (o.ext === suffix) {
                result.push(itemUri);
            }
        }
    }
    return result;
}
exports.getDirSuffixFiles = getDirSuffixFiles;
