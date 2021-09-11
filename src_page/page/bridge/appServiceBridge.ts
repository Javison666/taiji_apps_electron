import { AppItemName, IAppConfiguraiton } from 'src/client/workbench/protocals/commonProtocal'
import { AppServiceChannelCommand } from 'src/client/workbench/protocals/appServiceProtocal'

export const launchAppB = (appConf: IAppConfiguraiton) => {
    client.ipcRenderer.invoke('client:launchApp', appConf);
}

export const getAppsConfigurationListB = async () => {
    return client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
        channelType: AppServiceChannelCommand.mainCommand,
        channelCommand: AppServiceChannelCommand.subCommand.getAppsConfigurationList,
    })
}
