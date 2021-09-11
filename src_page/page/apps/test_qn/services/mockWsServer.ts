import clientInside from './clientInside'
import clientTest from './clientTest'

class MockWsServer {
    public static readonly INSTANCE = new MockWsServer()

    private _port = 30120

    private _app: any = null

    get port(){
        return this._port
    }

    async main(): Promise<void> {
        try {
            this.startUp()
        } catch (err) {
            console.log(err)
        }
    }

    async startUp(): Promise<void> {
        let express = client.app.require('express')
        let expressWs = client.app.require('express-ws')
        this._app = express();
        expressWs(this._app);
        this.handleWs()
        this.handleHttp()

        this._app.listen(this._port)
    }

    handleWs() {
        this._app.ws("/test", (ws: any) => {
            new clientTest(ws)
        })

        // qninside
        this._app.ws("/qninside", (ws: any) => {
            new clientInside(ws)
        })

    }

    handleHttp() {
        this._app.all('/json', (req: any, res: any) => {
            res.send([{
                "description": "",
                "devtoolsFrontendUrl": "/devtools/inspector.html?ws=127.0.0.1:55554/devtools/page/(A2ACD8C47B1A700F36F180B85577CD3D)",
                "id": "(A2ACD8C47B1A700F36F180B85577CD3D)",
                "title": "千牛消息聊天",
                "type": "page",
                "url": "alires:///WebUI/chatnewmsg/recent.html?debug=true&type=0&enable_report=1&dlguniqname=c94e4da1-3b8f-4110-b626-21319fff5585&param=%7B%22actiondata%22%3A%22%22%2C%22actiontype%22%3A0%2C%22cCode%22%3A%22%22%2C%22cid%22%3A%7B%22appkey%22%3A%22%22%2C%22nick%22%3A%22%22%7D%2C%22gids%22%3A%5B%5D%7D&lang=zh_CN",
                "webSocketDebuggerUrl": `ws://127.0.0.1:${this._port}/qninside`
            }])
        });
        // app.use('/', express.static(fileFromPageResource('')));
        this._app.all('*', function (req: any, res: any, next: any) {
            // res.setHeader('Content-Security-Policy', `default-src 'self' https://at.alicdn.com 'unsafe-inline' 'unsafe-eval'; style-src-elem '*'`);
            // res.setHeader('Content-Security-Policy', `*`);
            next();
        })
    }
}

export default MockWsServer