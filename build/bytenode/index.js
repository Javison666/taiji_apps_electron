"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBytenodeFiles = void 0;
const path = require("path");
const fs = require("fs");
const util_1 = require("./util");
const param_1 = require("./param");
const bytenode = require('bytenode');
async function handleBytenodeFileItem(filePath) {
    let absolutePath = path.join(process.cwd(), filePath);
    await bytenode.compileFile({
        filename: filePath,
        electron: true
    });
    await fs.unlinkSync(absolutePath);
}
function handleBytenodeFiles() {
    const result = () => new Promise(async (c, e) => {
        try {
            for (let filePath of param_1.bytenodeFiles) {
                let absolutePath = path.join(process.cwd(), filePath);
                if ((0, util_1.isDirectory)(filePath)) {
                    const files = (0, util_1.getDirSuffixFiles)(absolutePath, '.js').map(i => i.replace(process.cwd() + '\\', '').replace(process.cwd() + '\/', ''));
                    for (let fileUri of files) {
                        await handleBytenodeFileItem(fileUri);
                    }
                }
                else {
                    await handleBytenodeFileItem(filePath);
                }
            }
            c();
        }
        catch (err) {
            e(err);
        }
    });
    result.taskName = `bytenode`;
    return result;
}
exports.handleBytenodeFiles = handleBytenodeFiles;
exports.default = handleBytenodeFiles;
// "gulp-tsb": "^4.0.6",
