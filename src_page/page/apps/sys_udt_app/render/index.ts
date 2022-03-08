import { newVersionInfo, processNum, udtClientProcess } from "../use/useUdtClient"

interface IUpdateDownloadProcessData {
    uri: string,
    process: number
}

export default () => {
    client.ipcRenderer.on('render:updateDownloadProcess', (e, data: IUpdateDownloadProcessData) => {
        if (newVersionInfo.value.newVersionDetails.clientUrl === data.uri) {
            udtClientProcess(data.process)
        }
    })
}
