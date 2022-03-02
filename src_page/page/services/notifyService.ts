import { setAppStorage, getAppStorage } from 'src_page/page/bridge/itemStorageBridge'
import { IItemStorageItemType } from 'src/client/workbench/protocals/itemStorageProtocal'
import {
    got
} from 'src_page/page/utils/common'
import Logger from 'src/client/platform/environment/node/logger'
import { AppItemName } from 'src/client/workbench/protocals/commonProtocal'

// 通知渠道类型
export enum INotifyChannelType {
    ding = 'ding',
    mail = 'mail'
}

// 通知渠道名称
export type INotifyChannelName = string

export interface INotifyChannelMapItem {
    channelType: INotifyChannelType,
    channelJson: {
        Webhook?: string,
        tagValue?: string,
        mailAddr?: string
    },
    udtTime: number
}



// const instance = got.extend({
// 	hooks: {
// 		beforeRequest: [
// 			(options: any) => {
// 				options.headers['content-type'] = 'application/json';
// 			}
// 		]
// 	}
// });


// 通知功能
class NotifyService {
    public static readonly INSTANCE = new NotifyService()

    private _isChannelMapInit = false

    // 通知渠道集合
    private _channelMap: Map<INotifyChannelName, INotifyChannelMapItem> = new Map()

    // 将修改的渠道方式同步为本地
    public async syncDataToLocal() {
        await setAppStorage({
            itemName: IItemStorageItemType.notifyChannelList,
            itemContent: JSON.stringify([...NotifyService.INSTANCE._channelMap])
        })
    }

    // 将修改的渠道方式同步为本地
    public async syncDataFromLocal() {
        if (!NotifyService.INSTANCE._isChannelMapInit) {
            let response = await getAppStorage({
                targetAppName: AppItemName.Notify_App,
                itemName: IItemStorageItemType.notifyChannelList
            })
            if (response && response.error) {
                return
            }
            response && (NotifyService.INSTANCE._channelMap = new Map(JSON.parse(response)))
        }
    }

    // 初始化时用于获取渠道列表展示
    public getNotifyChannelList() {
        return [...NotifyService.INSTANCE._channelMap]
    }

    public getNotifyChannelByName(channelName: INotifyChannelName) {
        return NotifyService.INSTANCE._channelMap.get(channelName)
    }

    // 校验通知渠道名称是否已存在
    public isNotifyChannelNameExisted(channelName: INotifyChannelName) {
        if (channelName && this._channelMap.get(channelName)) {
            return true
        } else {
            return false
        }
    }

    // 添加或修改本地通知渠道
    public async setNotifyChannelItem(channelName: INotifyChannelName, channelItem: INotifyChannelMapItem) {
        if (channelItem.channelType === INotifyChannelType.ding) {
            const _channelItem = channelItem
            if (!_channelItem.channelJson.Webhook) {
                throw Error('ChannelDingItem Webhook is empty.')
            }
            if (!_channelItem.channelJson.tagValue) {
                throw Error('ChannelDingItem tagValue is empty.')
            }
        }
        NotifyService.INSTANCE._channelMap.set(channelName, channelItem)
        await NotifyService.INSTANCE.syncDataToLocal()
    }

    // 删除本地通道
    public async delNotifyChannelItem(channelName: INotifyChannelName) {
        NotifyService.INSTANCE._channelMap.delete(channelName)
        await NotifyService.INSTANCE.syncDataToLocal()
    }

    public toNotify(channelName: INotifyChannelName, message: string) {
        const channelItem = NotifyService.INSTANCE.getNotifyChannelByName(channelName)
        console.log('channelItem', channelItem)
        switch (channelItem?.channelType) {
            case INotifyChannelType.ding:
                got.post(channelItem.channelJson.Webhook, {
                    json: {
                        msgtype: "text",
                        text: {
                            content: `${channelItem.channelJson.tagValue} ${message}`
                        }
                    },
                    responseType: 'json'
                }).then((res: any) => {
                    console.log('toNotify', res)
                    let body: any = res.body
                    if (body.errcode) {
                        Logger.INSTANCE.error(JSON.stringify(res.body))
                    }

                })
                break
            default:
                break
        }
    }

}

export default NotifyService