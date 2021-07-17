import initData from './initData'
import registerListeners from './registerListeners'
import initApp from './initApp'

export function launchAppLifecycle(){
    // 初始化数据
    initData()
    // 初始化app
    initApp()
    // 监听app事件
    registerListeners()
}
