import { ref } from 'vue'

import ClientInside from 'src_page/page/apps/test_qn/services/clientInside'
import ClientCef from 'src_page/page/apps/test_qn/services/clientCef'
import ClientTest from 'src_page/page/apps/test_qn/services/clientTest'
import MockWsServer from 'src_page/page/apps/test_qn/services/mockWsServer'
import TestModule from '../services/test_module'


interface ILogItem {
    type: 'recv' | 'send',
    time: number,
    clientId: string | number,
    message: string,
    logType?: 'error'
}

const a_logList = ref(<ILogItem[]>[])
const b_logList = ref(<ILogItem[]>[])
// 日志同步
const isSyncBottom = ref(true)

// 是否测试运行中
const isRunnintTest = ref(false)

const curBuyerAddNum = ref(0)
const curBuyerMsgNum = ref(0)
const curCustomerMsgNum = ref(0)

const confBuyerAddNum = ref(0)
const confBuyerMessageContent = ref('')
const confBuyerMessageInterval = ref(1000)

export const addCurBuyerAddNum = () => {
    curBuyerAddNum.value++
}

export const addCurBuyerMsgNum = () => {
    curBuyerMsgNum.value++
}



let fnLoggerAChange = () => { }
let fnLoggerBChange = () => { }

export const addALogger = (item: ILogItem) => {
    // if (a_logList.value.length > 2000) {
    //     a_logList.value.shift()
    // }
    // a_logList.value.push(item)
    // if (isSyncBottom.value) {
    //     fnLoggerAChange()
    // }
}

export const addBLogger = (item: ILogItem) => {
    // if (b_logList.value.length > 2000) {
    //     b_logList.value.shift()
    // }
    // b_logList.value.push(item)
    // if (isSyncBottom.value) {
    //     fnLoggerBChange()
    // }
}

export const initTestModuleConf = async () => {
    const o = await TestModule.INSTANCE.getConfModule()
    confBuyerAddNum.value = o.buyer_num
    confBuyerMessageContent.value = o.message_content
    confBuyerMessageInterval.value = o.message_interval

    curBuyerAddNum.value = 0
    curBuyerMsgNum.value = 0
    curCustomerMsgNum.value = 0
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

    const udtTestClientSize = () => {
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

    const switchIsRunnintTest = () => {
        if (isRunnintTest.value) {
            TestModule.INSTANCE.stopTest()
        } else {
            if (!(insideClientSize.value > 0 && cefClientSize.value > 0)) {
                return client.ipcRenderer.showErrorBox(
                    '测试启动Error',
                    '小微未连接成功'
                )
            }
            curBuyerAddNum.value = 0
            curBuyerMsgNum.value = 0
            curCustomerMsgNum.value = 0

            const o = {
                buyer_num: confBuyerAddNum.value,
                message_content: confBuyerMessageContent.value,
                message_interval: confBuyerMessageInterval.value
            }

            TestModule.INSTANCE.udtModule(o)
            TestModule.INSTANCE.startTest(o)

        }

        isRunnintTest.value = !isRunnintTest.value

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
        switchSyncBottom,
        isRunnintTest,
        switchIsRunnintTest,
        curBuyerAddNum,
        curBuyerMsgNum,
        curCustomerMsgNum,
        initTestModuleConf,
        confBuyerAddNum,
        confBuyerMessageContent,
        confBuyerMessageInterval
    }
}
