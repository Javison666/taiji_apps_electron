import { test_root_path } from './test_env'
import ClientCef from './clientCef'
import { addCurBuyerAddNum, addCurBuyerMsgNum } from '../use/useClientManage'

const fs = client.app.require('fs')
const fsExtra = client.app.require('fs-extra')
const ini = client.app.require('ini')
const path = client.app.require('path')

export interface IBuyerItem {
    nick: string,
    ccode: string,
    targetId: string
}

class TestModule {
    public static readonly INSTANCE = new TestModule()
    public static iniName = 'test_module.ini'
    public static iniPath = path.join(test_root_path, TestModule.iniName)
    private _timer: any = null
    private _buyerList: IBuyerItem[] = []

    public async initModule() {
        try {
            if (fsExtra.pathExistsSync(TestModule.iniPath)) {
                const o = ini.parse(fs.readFileSync(TestModule.iniPath, 'utf8'))
                if (!(o['test-1'] &&
                    o['test-1'].buyer_num &&
                    o['test-1'].message_content &&
                    o['test-1'].message_interval
                )) {
                    this.writeInitModule()
                }
            } else {
                this.writeInitModule()
            }
        } catch (err) {
            this.writeInitModule()
        }

    }

    public async getConfModule() {
        const o = ini.parse(fs.readFileSync(TestModule.iniPath, 'utf8'))
        return o['test-1']
    }

    public async writeInitModule() {
        const cfgIni = {
            'test-1': {
                buyer_num: '100',
                message_content: '你好',
                message_interval: '1000'
            }
        }
        await fsExtra.mkdirp(test_root_path)
        fs.writeFileSync(TestModule.iniPath, ini.stringify(cfgIni), {
            encoding: 'utf-8'
        })
    }

    public async udtModule({ buyer_num, message_content, message_interval }: any) {
        const cfgIni = {
            'test-1': {
                buyer_num: buyer_num,
                message_content: message_content,
                message_interval: message_interval
            }
        }
        await fsExtra.mkdirp(test_root_path)
        fs.writeFileSync(TestModule.iniPath, ini.stringify(cfgIni), {
            encoding: 'utf-8'
        })
    }

    private loopTest(cef: ClientCef, message_content: string, message_interval: any) {
        this._timer = setTimeout(() => {
            for(let buyerItem of this._buyerList){
                cef?.sendMockBuyerMessage(buyerItem, message_content)
                addCurBuyerMsgNum()
            }
            this.loopTest(cef, message_content, message_interval)
        }, message_interval)
    }

    public async startTest({ buyer_num, message_content, message_interval }: any) {
        clearTimeout(this._timer)
        let now = Date.now()
        this._buyerList = []
        let cef = ClientCef.getCef()
        if(!cef){
            return
        }
        for (let i = 0; i < buyer_num; i++) {
            let buyerItem = {
                nick: `test_${now}_${i}`,
                targetId: `17${now}${i}`,
                ccode: `17${now}${i}.1-3382299715.1#11001@cntaobao`
            }
            this._buyerList.push(buyerItem)
            cef.sendMockBuyerAddMessage(buyerItem)
            addCurBuyerAddNum()

        }
        this.loopTest(cef, message_content, message_interval)
    }

    public async stopTest (){
        clearTimeout(this._timer)
    }

}

export default TestModule