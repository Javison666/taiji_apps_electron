import { toRaw, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal';
import { LightCodeChannelCommand, ILightCodeApp, StepTypeCode } from 'src/client/workbench/protocals/lightCodeServiceProtocal'

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

    let lightCodeApp = ref(<ILightCodeApp>getDefaultApp())
    let lightCodeAppList = ref(<string[]>[])
    let isNewPage = ref(true)

    const initLightCodeList = async () => {
        let list = await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
            channelType: LightCodeChannelCommand.mainCommand,
            channelCommand: LightCodeChannelCommand.subCommand.getLightCodeAppList,
        })
        lightCodeAppList.value = list
    }

    // 初始化leetcode编辑页面
    const initLightCodeApp = async () => {
        lightCodeApp.value = getDefaultApp()
        isNewPage.value = true
        if (route.query.status === 'edit' &&
            typeof route.query.name === 'string') {
            isNewPage.value = false
            lightCodeApp.value = await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
                channelType: LightCodeChannelCommand.mainCommand,
                channelCommand: LightCodeChannelCommand.subCommand.getLightCodeTaskByName,
                reqData: {
                    name: route.query.name
                }
            })
        }
    }

    const clearLightCodeApp = async () => {
        lightCodeApp.value = getDefaultApp()
        if (
            route.query.status === 'edit' &&
            typeof route.query.name === 'string'
        ) {
            lightCodeApp.value.name = route.query.name
        }
    }

    // 新增步骤
    const addLightCodeStep = (idx: number) => {
        const newStep = {
            stepType: StepTypeCode.cmd,
            remark: '',
            value: ''
        }
        lightCodeApp.value.steps.splice(idx, 0, newStep)
    }

    // 删除步骤
    const delLightCodeStep = (idx: number) => {
        lightCodeApp.value.steps.splice(idx, 1)
    }

    // 保存配置
    const saveLightCodeApp = async () => {
        if (isNewPage.value) {
            let isExisted = await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
                channelType: LightCodeChannelCommand.mainCommand,
                channelCommand: LightCodeChannelCommand.subCommand.isLightCodeTaskFileExistedByName,
                reqData: {
                    name: lightCodeApp.value.name
                }
            })
            if (isExisted) {
                return client.ipcRenderer.showErrorBox("添加应用失败", "应用名称已存在");
            }
        }
        await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
            channelType: LightCodeChannelCommand.mainCommand,
            channelCommand: LightCodeChannelCommand.subCommand.saveLightCodeApp,
            reqData: toRaw(lightCodeApp.value)
        })
        router.push({
            path: '/localTasks/list'
        })
    }

    const delLightCodeTaskByName = async (name: string) => {
        const res = await client.ipcRenderer.invoke(
            "client:showHandleWindow",
            `确认删除快捷操作(${name})吗?`
        );
        if (res) {
            await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
                channelType: LightCodeChannelCommand.mainCommand,
                channelCommand: LightCodeChannelCommand.subCommand.delLightCodeAppByName,
                reqData: {
                    name
                }
            })
        }
    }

    const runLightCodeTaskByName = async (name: string) => {
        await client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
            channelType: LightCodeChannelCommand.mainCommand,
            channelCommand: LightCodeChannelCommand.subCommand.runLightCodeTaskByName,
            reqData: {
                name
            }
        })
    }

    return {
        isNewPage,
        lightCodeApp: lightCodeApp,
        lightCodeAppList: lightCodeAppList,
        initLightCodeApp: initLightCodeApp,
        initLightCodeList: initLightCodeList,
        clearLightCodeApp: clearLightCodeApp,
        addLightCodeStep: addLightCodeStep,
        delLightCodeStep: delLightCodeStep,
        saveLightCodeApp: saveLightCodeApp,
        runLightCodeTaskByName: runLightCodeTaskByName,
        delLightCodeTaskByName: delLightCodeTaskByName
    }
}


