import ClientCef from 'src_page/page/apps/test_qn/services/clientCef'

export default () => {

    const startTest = () => {
        
    }

    const useMockBuyerMessage = () => {
        ClientCef.sendAllWs({
            data: {
                result:[{
                    "fromid": {
                        "nick": "javison666"
                    },
                    "toid": {
                        "nick": "小薇薇抱抱:引力"
                    },
                    "originalData": {
                        "jsview": [{
                            "type": 0,
                            "value": {
                                "text": "你好"
                            }
                        }]
                    },
                    "mcode": {
                        "clientId": "6841915058562269466",
                        "messageId": "959653690691.PNM"
                    },
                    "sendTime": "1631239666476",
                    "cid": {
                        "ccode": "2153277040.1-778955163.1#11001@cntaobao"
                    }
                }]
            }
        }, 40)
    }

    return {
        useMockBuyerMessage
    }
}