import Logger from 'src/client/platform/environment/node/logger'
import {
    ITaskName,
    TaskStatus,
    TaskItem,
    VersionItem,
    TaskDingItem,
} from '../interfaces/task'
import { lowdb as low, path } from 'src_page/page/utils/common'

const FileSync = client.app.require('lowdb/adapters/FileSync')

const dbPath = path.join(client.app.userDataPath, './backdata/storage/scan_udt_app.db')

const adapter = new FileSync(dbPath)
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({
    tasks: [],
    taskDing: [],
    versions: []
}).write()

class LowdbService {
    public static readonly INSTANCE = new LowdbService()

    private _db = db

    public isTaskExisted(taskName: ITaskName) {
        if (!LowdbService.INSTANCE._db.get('tasks')
            .find({ taskName })
            .value()) {
            return false
        } else {
            return true
        }
    }

    public taskAddDb(task: TaskItem) {
        if (!LowdbService.INSTANCE.isTaskExisted(task.taskName)) {
            LowdbService.INSTANCE._db.get('tasks')
                .push(task)
                .write()
        }
    }

    public taskDelDb(taskName: ITaskName) {
        if (!taskName) {
            return Logger.INSTANCE.error('removeTaskDb: taskName is empty')
        }

        LowdbService.INSTANCE._db.get('tasks')
            .remove({ taskName })
            .write()
    }

    public taskNotFreeDb(taskName: ITaskName) {
        LowdbService.INSTANCE._db.get('tasks')
            .find({ taskName: taskName })
            .assign({ taskStatus: TaskStatus.NotFree })
            .write()
    }

    public taskFreeDb(taskName: ITaskName) {
        LowdbService.INSTANCE._db.get('tasks')
            .find({ taskName: taskName })
            .assign({
                taskStatus: TaskStatus.Free,
            })
            .write()
    }

    public taskFreeAllDb() {
        LowdbService.INSTANCE._db.get('tasks')
            .find({})
            .assign({
                taskStatus: TaskStatus.Free,
            })
            .write()
    }

    public taskUdtDb(task: TaskItem) {
        if (!LowdbService.INSTANCE.isTaskExisted(task.taskName)) {
            LowdbService.INSTANCE._db.get('tasks')
                .push(task)
                .write()
        } else {
            LowdbService.INSTANCE._db.get('tasks')
                .find({ taskName: task.taskName })
                .assign(task)
                .write()
        }
    }

    public taskListDbFask() {
        const tasks: TaskItem[] = LowdbService.INSTANCE._db.get('tasks')
            .value()
        return tasks
    }

    public taskGetByNameDbFast(taskName: ITaskName) {
        const task: TaskItem = LowdbService.INSTANCE._db.get('tasks')
            .find({ taskName })
            .value()
        return task
    }

    public isTaskDingExisted(dingItem: TaskDingItem) {
        if (!LowdbService.INSTANCE._db.get('taskDing')
            .find({ taskName: dingItem.taskName, dingName: dingItem.dingName })
            .value()) {
            return false
        } else {
            return true
        }
    }

    public taskDingListDbFast(taskName: ITaskName) {
        let taskDingList: TaskDingItem[] = LowdbService.INSTANCE._db.get('taskDing')
            .find({ taskName })
            .value()
        return taskDingList
    }

    public taskDingAddDb(taskDingItem: TaskDingItem) {
        db.get('taskDing')
            .push(taskDingItem)
            .write()
    }

    public taskDingDelDb(taskDingItem: TaskDingItem) {
        db.get('taskDing')
            .remove({ taskName: taskDingItem.taskName, dingName: taskDingItem.dingName })
            .write()
    }

    public versionAddDb(versionItem: VersionItem) {
        db.get('versions')
            .push(versionItem)
            .write()
    }

    public versionDelDb(versionTime: string) {
        db.get('versions')
            .remove({ versionTime })
            .write()
    }

    public versionUdtDb(versionItem: VersionItem) {
        db.get('versions')
            .find({ versionTime: versionItem.versionTime })
            .assign(versionItem)
            .write()
    }

    public versionPageDbFast(taskName: string, pageNum?: number, pageSize?: number) {
        let ls
        if (taskName === '') {
            ls = LowdbService.INSTANCE._db.get('tasks')
                .value()
        } else {
            ls = LowdbService.INSTANCE._db.get('tasks')
                .find({ taskName })
                .value()
        }
        if (pageNum === void (0)) {
            return ls
        }
        if (pageSize === void (0)) {
            return ls
        }
        return ls.slice(pageNum * pageSize - 1, (Number(pageNum) + 1) * pageSize)
    }
}

export default LowdbService
