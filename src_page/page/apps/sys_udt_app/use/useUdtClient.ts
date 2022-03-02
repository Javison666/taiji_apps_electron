import { INewVersionInfo, IVersionInfoData } from 'src/client/workbench/protocals/versionUdtServiceProtocal';
import { getNewVersionInfoBridge, startUdtClientBridge } from "src_page/page/bridge/versionUdtBridge";
import { ref } from 'vue'
// import { useRoute } from "vue-router";

// const route = useRoute();
// if (route.query.version) {
//     versionStr.value = String(route.query.version)
// }

// if (route.query.url) {
//     versionUrl.value = String(route.query.url)
// }

// 用于检测网络的缺省值
const checkNetCacheProcess = {
    curProcess: 0,
    times: 0
}

// 初始化-2 安装失败 -1 真实进度0-100 
export const processNum = ref(-2)
// 下载进度
const processValue = ref(0)
const isStartUdt = ref(false)
const newVersionInfo = ref(<INewVersionInfo>{
    newVersionDetails: {
        addRemarkList: [],
        improveRemarkList: [],
        repairRemarkList: [],
        versionNo: '',
        clientUrl: ''
    },
    newVersionAvailable: false,
    newVersionReady: false
})

export default () => {
    // 从服务端拉取新数据
    const getNewVersionInfo = async () => {
        newVersionInfo.value = await getNewVersionInfoBridge()
    }

    // 开始更新客户端
    const startUdtClient = () => {
        client.ipcRenderer.send('client:setClosable', false)
        checkNetCacheProcess.curProcess = 0
        checkNetCacheProcess.times = 0

        processNum.value = 0
        processValue.value = 0
        isStartUdt.value = true
        startUdtClientBridge()
        setTimeout(() => {
            udtClientProcess()
        }, 300)
    }

    // 开始更新进度
    const udtClientProcess = async () => {
        let process = await client.ipcRenderer.invoke('client:getBackServiceDownloadProcess', newVersionInfo.value.newVersionDetails.clientUrl)
        console.log('process', process)
        if (process === -1) {
            processNum.value = -1
            client.ipcRenderer.send('client:setClosable', true)
            return
        }

        if (checkNetCacheProcess.curProcess === process) {
            checkNetCacheProcess.times += 1
        } else{
            checkNetCacheProcess.times = 0
            checkNetCacheProcess.curProcess = process
        }

        if(checkNetCacheProcess.times > 30){
            processNum.value = -1
            client.ipcRenderer.send('client:cancelDownloadItem', newVersionInfo.value.newVersionDetails.clientUrl)
            client.ipcRenderer.send('client:setClosable', true)
            return
        }

        if (process>=0 && process < 1) {
            // 实际进程进度
            processNum.value = Number(Number(process * 100).toFixed(2))
            setTimeout(() => {
                udtClientProcess()
            }, 300)
        } else {
            // 下载进度
            processNum.value = Number(Number(99).toFixed(2))
            processValue.value = Number(Number(process*100).toFixed(2))
            return
        }
        processValue.value = Math.floor(processNum.value)
    }

    return {
        processNum,
        processValue,
        isStartUdt,
        newVersionInfo,
        getNewVersionInfo,
        startUdtClient
    }
}