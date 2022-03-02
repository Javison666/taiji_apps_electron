import Logger from 'src/client/platform/environment/node/logger'
import clientInside from './clientInside'

class clientTest {

    private static clients: Set<any> = new Set()

    private _ws: any = null

    static get clientSize() {
        return clientTest.clients.size
    }

    static sendAll(msg: any) {
        for (let client of clientTest.clients) {
            client.send(msg)
        }
    }

    constructor(ws: any) {
        this._ws = ws
        clientTest.clients.add(this)

        this._ws.on("message", (msg: string) => {
            // Logger.INSTANCE.info('client test recv:', msg)
            this.handleMessage(msg)
        });

        this._ws.on("close", () => {
            // Logger.INSTANCE.info('client test closed')
            clientTest.clients.delete(this)
        })
    }

    handleMessage(msg: string) {
        try {
            // let o = JSON.parse(msg)
            // if (o.clientId) {
            //     clientInside.sendClient(o.clientId, o.message)
            // } else {
            //     clientInside.sendAll(o.message)
            // }

        } catch (err) {
            Logger.INSTANCE.error(err)
        }
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
        } catch (err) {
            Logger.INSTANCE.error(err)
        }
    }


}

export default clientTest
