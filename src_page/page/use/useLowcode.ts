import { toRaw, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { ILowcodeApp, StepTypeCode } from 'src_page/page/types/defineLowcode'



const getDefaultApp = () => ({
    name: '',
    steps: [{
        stepType: StepTypeCode.cmd,
        remark: '',
        value: ''
    }]
})

export default () => {

    const route = useRoute()
    const router = useRouter()

    let lowcodeApp = ref(<ILowcodeApp>getDefaultApp())
    let ttcodeAppList = ref(<string[]>[])
    let isNewPage = ref(true)

    const initTTcodeList = async () => {
        let list = await client.ipcRenderer.invoke('client:getTTcodeAppList')
        ttcodeAppList.value = list
    }

    // 初始化leetcode编辑页面
    const initLowcodeApp = async () => {
        lowcodeApp.value = getDefaultApp()
        isNewPage.value = true
        if (route.query.status === 'edit' &&
            typeof route.query.name === 'string') {
            isNewPage.value = false
            lowcodeApp.value = await client.ipcRenderer.invoke('client:getTTcodeTaskByName', route.query.name)
        }
    }


    const clearLowcodeApp = async () => {
        lowcodeApp.value = getDefaultApp()
        if (
            route.query.status === 'edit' &&
            typeof route.query.name === 'string'
        ) {
            lowcodeApp.value.name = route.query.name
        }
    }

    // 新增步骤
    const addLowcodeStep = (idx: number) => {
        const newStep = {
            stepType: StepTypeCode.cmd,
            remark: '',
            value: ''
        }
        lowcodeApp.value.steps.splice(idx, 0, newStep)
    }

    // 删除步骤
    const delLowcodeStep = (idx: number) => {
        lowcodeApp.value.steps.splice(idx, 1)
    }

    // 保存配置
    const saveLowcodeApp = async () => {
        if(isNewPage.value){
            let isExisted = await client.ipcRenderer.invoke('client:isTTcodeTaskFileExistedByName', lowcodeApp.value.name)
            if(isExisted){
                return client.ipcRenderer.showErrorBox("添加应用失败", "应用名称已存在");
            }
        }
        await client.ipcRenderer.invoke('client:saveLowcodeApp', toRaw(lowcodeApp.value))
        router.push({
            path: '/localTasks/list'
        })
    }

    const delTTcodeTaskByName = async (name: string) => {
        const res = await client.ipcRenderer.invoke(
            "client:showHandleWindow",
            `确认删除快捷操作(${name})吗?`
        );
        if(res){
            await client.ipcRenderer.invoke('client:delLowcodeAppByName', name)
        }
    }

    const runTTcodeTaskByName = async (name: string) => {
        await client.ipcRenderer.invoke('client:runTTcodeTaskByName', name)
    }

    return {
        isNewPage,
        lowcodeApp,
        ttcodeAppList,
        initLowcodeApp,
        initTTcodeList,
        clearLowcodeApp,
        addLowcodeStep,
        delLowcodeStep,
        saveLowcodeApp,
        runTTcodeTaskByName,
        delTTcodeTaskByName
    }
}


