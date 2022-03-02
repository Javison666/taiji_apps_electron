import { processNum } from "../use/useUdtClient"

interface ICallBridgeMsg {
    cmd: string,
    data: any
}

export default (data: ICallBridgeMsg) => {
    if (data.cmd === 'udtClientSuccess') {
        processNum.value = 100
        client.ipcRenderer.send('client:setClosable', true)
    }
}