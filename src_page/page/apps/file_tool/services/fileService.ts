const fs = client.app.require('fs')
const readline = client.app.require('readline');

class FileService {

    private _filePath = ''
    private _fileSize = 0

    constructor(filePath: string) {
        this._filePath = filePath
        const size = fs.fstatSync(this._filePath)
    }

    splitFile() {
        
        //创建文件流
        let readStream = fs.createReadStream(this._filePath, {
            start: 0,
            end: 1000
        });
        let writeStream = fs.createWriteStream(this._filePath)
        readStream.pipe(writeStream)
    }

}

export default FileService