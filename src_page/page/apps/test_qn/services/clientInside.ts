import Logger from 'src/client/platform/environment/node/logger'
import { addALogger } from 'src_page/page/apps/test_qn/use/useClientManage'
import ClientCef from './clientCef'

let clientId = 1000000

class ClientInside {

    private static clients: Set<any> = new Set()

    private _ws: any = null

    private _clientId: any = null

    static get clientSize() {
        return ClientInside.clients.size
    }

    get clientId() {
        return this._clientId
    }

    static sendClient(clientId: number, msg: any) {
        let client = [...ClientInside.clients].find(i => i.clientId === clientId)
        if (client) {
            client.send(msg)
        }
    }

    static sendAll(msg: any) {
        for (let client of ClientInside.clients) {
            client.send(msg)
        }
    }

    constructor(ws: any) {
        this._ws = ws
        this._clientId = clientId
        clientId++
        ClientInside.clients.add(this)

        this._ws.on("message", (msg: string) => {
            // ClientTest.sendAll({
            //     clientId: this._clientId,
            //     message: msg
            // })


            this.handleMessage(msg)
        });

        this._ws.on("close", () => {
            Logger.INSTANCE.info('client inside closed')
            ClientInside.clients.delete(this)
        })
    }

    handleMessage(msg: string) {
        // let data
        // try{
        //     data = JSON.parse(msg)
        // }catch(err){
        //     Logger.INSTANCE.info(this._clientId, 'recv from inside err:', err)
        // }
        if (!msg) {
            return
        }
        if (ClientCef.clientSize > 0) {
            addALogger({
                type: 'recv',
                clientId: this._clientId,
                time: Date.now(),
                message: msg.substr(0, 80)
            })
            return
        }
        if (msg.includes("_qn_ws_addr=''")) {
            addALogger({
                type: 'recv',
                clientId: this._clientId,
                time: Date.now(),
                logType: 'error',
                message: 'index.js => 注入inside的ws地址为空'
            })
            return
        }
        if (msg.includes('window._qn_ws_addr')) {
            let reg = msg.match(/'([^']+)'/)
            if (reg) {
                let uri = reg[1] + '&t=6'
                new ClientCef(uri)
                this.send({ "id": 1, "result": { "result": { "type": "boolean", "value": true } } })
                Logger.INSTANCE.info(this._clientId, 'recv from inside:', 'index.js', uri)
                addALogger({
                    type: 'recv',
                    clientId: this._clientId,
                    time: Date.now(),
                    message: 'index.js => ' + uri
                })
                return
            }

            return
        }
        // if (data && data.method === 'Runtime.evaluate' && data.params && data.params.expression) {
        //     // let uri = 'wss://127.0.0.1:30120?appkey=&qnVersion=&nick='
        //     if(data.params.expression.includes("_qn_ws_addr=''")){
        //         addALogger({
        //             type: 'recv',
        //             clientId: this._clientId,
        //             time: Date.now(),
        //             logType: 'error',
        //             message: 'index.js => 注入inside的ws地址为空'
        //         })
        //         return
        //     }
        //     if (data.params.expression.includes('window._qn_ws_addr')) {
        //         let uri = data.params.expression.match(/'([^']+)'/)[1]
        //         console.log('uri', uri)
        //         new ClientCef(uri)
        //         this.send({ "id": data.id, "result": { "result": { "type": "boolean", "value": true } } })
        //         Logger.INSTANCE.info(this._clientId, 'recv from inside:', 'index.js', uri)
        //         addALogger({
        //             type: 'recv',
        //             clientId: this._clientId,
        //             time: Date.now(),
        //             message: 'index.js => ' + uri
        //         })
        //         return
        //     }
        // }

        Logger.INSTANCE.info(this._clientId, 'recv from inside:', msg)
        addALogger({
            type: 'recv',
            clientId: this._clientId,
            time: Date.now(),
            message: msg
        })
    }

    send(msg: any) {
        try {
            let sendData
            if (Object.prototype.toString.call(msg) === '[object String]') {
                sendData = msg
            } else {
                sendData = JSON.stringify(msg)
            }
            this._ws.send(sendData)
            addALogger({
                type: 'send',
                clientId: this._clientId,
                time: Date.now(),
                message: sendData
            })
            Logger.INSTANCE.info(this._clientId, 'send to inside:', msg)
        } catch (err) {
            Logger.INSTANCE.error(err)
        }
    }

}

export default ClientInside
