import { ref } from 'vue'

import ClientInside from 'src_page/page/apps/test_qn/services/clientInside'
import ClientCef from 'src_page/page/apps/test_qn/services/clientCef'
import ClientTest from 'src_page/page/apps/test_qn/services/clientTest'
import MockWsServer from 'src_page/page/apps/test_qn/services/mockWsServer'


interface ILogItem{
    type: 'recv' | 'send',
    time: number,
    clientId: string | number,
    message: string
}

const a_logList = ref(<ILogItem[]>[])
const b_logList = ref(<ILogItem[]>[])
const isSyncBottom = ref(true)

let fnLoggerAChange = () => {}
let fnLoggerBChange = () => {}

export const addALogger = (item: ILogItem) => {
    a_logList.value.push(item)
    if(isSyncBottom.value) {
        fnLoggerAChange()
    }
}

export const addBLogger = (item: ILogItem) => {
    b_logList.value.push(item)
    if(isSyncBottom.value) {
        fnLoggerBChange()
    }
}


// for(let i=0;i<500000; i++){
//     addLogger({
//         type: 'send',
//         clientId: '100000',
//         time: Date.now(),
//         message: 'asglaskgfl;asdgl;asl;dgfl;asdfkl'
//     })
// }

export default () => {

    const insideClientSize = ref(0)
    const cefClientSize = ref(0)
    const testClientSize = ref(0)
    
    const wsServerPort = ref(MockWsServer.INSTANCE.port)

    const udtInsideClientSize = () => {
        insideClientSize.value = ClientInside.clientSize
    }

    const udtCefClientSize = () => {
        cefClientSize.value = ClientCef.clientSize
    }

    const udtTestClientSize =  () => {
        testClientSize.value = ClientTest.clientSize
    }

    const registerAScrollToBottom = (fn: any) => {
        fnLoggerAChange = fn
    }

    const registerBScrollToBottom = (fn: any) => {
        fnLoggerBChange = fn
    }

    const switchSyncBottom = () => {
        isSyncBottom.value = !isSyncBottom.value
    }

    return {
        insideClientSize,
        cefClientSize,
        testClientSize,
        wsServerPort,
        udtInsideClientSize,
        udtTestClientSize,
        udtCefClientSize,
        a_logList,
        b_logList,
        registerAScrollToBottom,
        registerBScrollToBottom,
        isSyncBottom,
        switchSyncBottom
    }
}