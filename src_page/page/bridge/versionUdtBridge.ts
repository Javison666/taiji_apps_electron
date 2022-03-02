import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'
import { VersionUdtChannelCommand, INewVersionInfo } from 'src/client/workbench/protocals/versionUdtServiceProtocal'

export const getNewVersionInfoBridge = async (): Promise<INewVersionInfo> => {
    return client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
        channelType: VersionUdtChannelCommand.mainCommand,
        channelCommand: VersionUdtChannelCommand.subCommand.getNewVersionInfo,
    })
}


export const startUdtClientBridge = async (): Promise<INewVersionInfo> => {
    return client.ipcMessagePort.callApp(AppItemName.Shared_Process, {
        channelType: VersionUdtChannelCommand.mainCommand,
        channelCommand: VersionUdtChannelCommand.subCommand.startUdtClient,
    })
}
