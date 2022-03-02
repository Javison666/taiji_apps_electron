import Logger from "src/client/platform/environment/node/logger"
import { addBLogger } from 'src_page/page/apps/test_qn/use/useClientManage'
import { IBuyerItem } from './test_module'

interface IClientCefClients {
    uri: string,
    client: ClientCef
}

let client_id = 2000000

class ClientCef {

    public static clients: IClientCefClients[] = []

    private _ws: any = null
    private _qn_appkey = ''
    private _qn_version = ''
    private _qn_nick = ''
    private _qn_ws_sessionId = 0
    private _req_id = 1
    private _client_id = 0

    static getCef() {
        if(ClientCef.clients.length>0){
            return ClientCef.clients[0].client
        }else{
            return null
        }
    }

    static get clientSize() {
        return ClientCef.clients.length
    }

    get clientId() {
        return this._client_id
    }

    constructor(uri: string) {
        if (ClientCef.clients.find((i: any) => i.uri === uri)) {
            return
        }
        this._client_id = client_id
        client_id++
        this.initUri(uri)
        this._ws = new WebSocket(uri)
        this._ws.onopen = () => {
            this.sendws({}, 0)
        }
        this._ws.onmessage = (msg: any) => {
            addBLogger({
                type: 'recv',
                clientId: this._client_id,
                time: Date.now(),
                message: msg.data
            })
        }
        ClientCef.clients.push({
            uri,
            client: this
        })
    }

    initUri(uri: string) {
        uri && uri.split('?')[1].split('&').forEach((i: any) => {
            i = i.split('=')
            if (i[0] === 'appkey') {
                this._qn_appkey = i[1]
            }
            if (i[0] === 'qnVersion') {
                this._qn_version = i[1]
            }
            if (i[0] === 'nick') {
                this._qn_nick = decodeURIComponent(i[1])
            }
        })
        this._qn_ws_sessionId = parseInt(String(Math.random() * 10000000))
    }

    static sendAllWs(data: any, req_action: number) {
        for (let cef of ClientCef.clients) {
            cef.client.sendws(data, req_action)
        }
    }

    sendws(data: any, req_action: number) {
        if (req_action === 0) {
            this._req_id = 1
        }
        if (typeof data === 'string') {
            this._ws.send(data)
        } else {
            if (data.qnVersion === void (0)) {
                data.qnVersion = this._qn_version
            }
            if (data.forwardIsOpen === void (0)) {
                data.forwardIsOpen = true
            }
            if (data.shopWindowsTitleName === void (0)) {
                data.shopWindowsTitleName = this._qn_nick
            }
            if (data.nick === void (0)) {
                data.nick = 'v_6631_test_sess_' + this._qn_ws_sessionId
            }
            if (data.xw === void (0)) {
                data.xw = true
            }
            if (data.appkey === void (0)) {
                data.appkey = this._qn_appkey
            }
            if (data.data && !data.data.rpt_time) {
                data.data.rpt_time = new Date().getTime()
            }
            if (data.type && data.data) {
                data.data.biz__type = data.type
            }
            if (req_action === 0) {
                this._req_id = 1
                // sendData.req_id = this._req_id
            }
            let sendData = {
                req_id: this._req_id,
                req_action,
                req_ver: 1,
                data
            }
            
            let sendText = JSON.stringify(sendData)
            Logger.INSTANCE.info('cef_page to inside', this._client_id, sendText)
            this._ws.send(sendText)
            addBLogger({
                type: 'send',
                clientId: this._client_id,
                time: Date.now(),
                message: sendText
            })
            this._req_id = this._req_id + 1
        }
    }

    sendMockBuyerAddMessage(buyerItem: IBuyerItem) {
        this.sendws({
            data: {
                "code": 0,
                "subcode": 0,
                "result": {
                    "targetType": "3",
                    "nick": buyerItem.nick,
                    "targetId": buyerItem.targetId,
                    "ccode": buyerItem.ccode,
                    "ctype": 0,
                    "bizeType": "11001",
                    "display": buyerItem.nick,
                    "portrait": "pic:impicture",
                    "unreadcount": 0
                }
            }
        }, 50)
    }

    sendMockBuyerMessage(buyerItem: IBuyerItem, text: string) {
        this.sendws({
            data: {
                result: [{
                    "fromid": {
                        "nick": buyerItem.nick
                    },
                    "toid": {
                        "nick": this._qn_nick
                    },
                    "originalData": {
                        "jsview": [{
                            "type": 0,
                            "value": {
                                "text": text
                            }
                        }]
                    },
                    "mcode": {
                        "clientId": `684${Date.now()}${this._req_id}.PTC`,
                        "messageId": `959653690691${this._req_id}.PTM`
                    },
                    "sendTime": String(Date.now()),
                    "cid": {
                        "ccode": buyerItem.ccode
                    }
                }]
            }
        }, 40)
    }
}

export default ClientCef