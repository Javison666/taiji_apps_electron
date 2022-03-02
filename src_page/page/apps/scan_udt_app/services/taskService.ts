import Logger from 'src/client/platform/environment/node/logger'
import {
    ITaskName,
    TaskStatus,
    TaskItem,
} from '../interfaces/task'
import LowdbService from './lowdbService'
import {
    got,
    md5,
    cheerio
} from 'src_page/page/utils/common'
import NotifyService from 'src_page/page/services/notifyService'

const evalCheerio = (html: string, evalScript: string) => {
    const $ = cheerio.load(html);
    let scriptFn = eval(evalScript)
    return scriptFn($, md5)
}

interface IDingTaskItem {
    taskName: ITaskName,
    time: number
}

class TaskService {
    public static readonly INSTANCE = new TaskService()

    private _cacheDingTasks: IDingTaskItem[] = []

    public getTaskList() {
        return LowdbService.INSTANCE.taskListDbFask()
    }

    public addTask() {

    }

    public delTask() {

    }

    public updateTask() {

    }

    public initialize() {
        LowdbService.INSTANCE.taskFreeAllDb()
    }

    public async checkVersion(task: TaskItem) {
        let now = Date.now()
        Logger.INSTANCE.info(`[Heartbeat]${new Date(now).toLocaleDateString() + ' ' + new Date(now).toLocaleTimeString()}--${task.taskName}`)
        LowdbService.INSTANCE.taskNotFreeDb(task.taskName)

        const requestURI = got(task.taskURI, {
            timeout: 6000
        });
        try {
            let response = await requestURI;
            let currentMd5

            // 拉取html进行md5计算
            now = Date.now()

            if (task.taskRepScript) {
                currentMd5 = evalCheerio(response.body, task.taskRepScript)
            } else {
                currentMd5 = md5(response.body)
            }

            // 初始化
            if (!task.versionLastMd5) {
                task.versionLastMd5 = currentMd5
                task.versionLastTime = now
            }

            if (task.versionLastMd5 !== currentMd5) {

                task.versionLastMd5 = currentMd5
                task.versionLastTime = now

                LowdbService.INSTANCE.versionAddDb({
                    taskName: task.taskName,
                    versionTime: now,
                    versionTimeVal: new Date(now).toLocaleDateString() + ' ' + new Date(now).toLocaleTimeString(),
                    versionMd5: currentMd5
                })

                // notify
                if (task.channelNames && task.channelNames.length > 0) {
                    let cachaDingItem = TaskService.INSTANCE._cacheDingTasks.find(i => i.taskName === task.taskName)
                    if (cachaDingItem) {
                        if (cachaDingItem && now - cachaDingItem.time <= 30 * 60 * 1000) {
                            return
                        } else {
                            TaskService.INSTANCE._cacheDingTasks = TaskService.INSTANCE._cacheDingTasks.filter(i => i.taskName !== task.taskName)
                        }
                    }

                    TaskService.INSTANCE._cacheDingTasks.push({
                        taskName: task.taskName,
                        time: Date.now()
                    })

                    task.channelNames.forEach(channelName => {
                        NotifyService.INSTANCE.toNotify(channelName, `${task.taskName} 发现更新，标识为 ${task.versionLastMd5}，请查看`)
                    })
                }

                Logger.INSTANCE.info(`${new Date(now).toLocaleDateString() + ' ' + new Date(now).toLocaleTimeString()} : ${response.body}`)
            }

            task.taskLastTime = now
        } catch (error) {
            // if (requestURI.isCanceled) { // Or `error instanceof got.CancelError`
            // 	// Handle cancelation
            // }
            // Handle other errors
            Logger.INSTANCE.error(error)
            task.taskLastTime = Date.now()
        }

        LowdbService.INSTANCE.taskUdtDb(task)
        LowdbService.INSTANCE.taskFreeDb(task.taskName)
    }

    // 测试脚本返回内容
    public async testTaskRepScript(task: TaskItem) {
        const requestURI = got(task.taskURI);
        try {
            let response = await requestURI;
            console.log(response)
            if (task.taskRepScript) {
                return evalCheerio(response.body, task.taskRepScript)
            } else {
                return response.body
            }

        } catch (error) {
            // if (requestURI.isCanceled) { // Or `error instanceof got.CancelError`
            // 	// Handle cancelation
            // }
            // Handle other errors
            return error
        }
    }

    public async runTask() {
        console.log('runTask')

        const tasks = LowdbService.INSTANCE.taskListDbFask()
        const now = Date.now()

        for (let task of tasks) {

            if (task.taskStatus === TaskStatus.NotFree) {
                continue
            }

            if (Number(task.taskInterval) === 0) {
                continue
            }

            if (now - Number(task.taskLastTime) < Number(task.taskInterval) * 1000) {
                continue
            }

            
            await TaskService.INSTANCE.checkVersion(task)
        }

        setTimeout(async () => {
            await TaskService.INSTANCE.runTask()
        }, 1000)
    }

}

export default TaskService