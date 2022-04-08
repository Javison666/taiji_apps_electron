// 模板文件如下
// ==项目A
// {}
// ##cmd
// --code E:\gitlab\step
// ##cmd
// ++32
// code E:\gitlab\clientstep
// code .
// ##
import fs = require('fs')
import { isMacintosh, isWindows } from 'client/base/common/platform'
import Logger from 'client/platform/environment/node/logger'
import { execSync } from 'child_process'

enum StepTypeCode {
    none = '',
    cmd = 'cmd',
    bash = 'bash'
}

interface ITaskStep {
    // 任务类型
    stepType: StepTypeCode
    // 备注
    remark: string,
    // 任务执行内容
    value: string
}

export interface ITaskConf {
    name: string,
    runInNewProcess?: boolean,
    steps: ITaskStep[]
}

class LightCodeService {
    public static readonly INSTANCE = new LightCodeService()
    constructor() { }

    runTTFileSync(uri: string) {
        const taskConf = LightCodeService.INSTANCE.decodeTTFileSync(uri)
        LightCodeService.INSTANCE.runTaskConfSync(taskConf)
    }

    runTaskConfSync(taskConf: ITaskConf) {
        if (taskConf.runInNewProcess) {
            return
        }
        for (let step of taskConf.steps) {
            switch (step.stepType) {
                case StepTypeCode.cmd:
                    if (isWindows && step.value) {
                        const stdout = execSync(step.value, { cwd: process.cwd(), encoding: 'utf8' })
                        stdout && Logger.INSTANCE.info('stdout: ', stdout)
                    }
                    break
                case StepTypeCode.bash:
                    if (isMacintosh && step.value) {
                        const stdout = execSync(step.value, { cwd: process.cwd(), encoding: 'utf8' })
                        stdout && Logger.INSTANCE.info('stdout: ', stdout)
                    }
                    break
                default:
                    break
            }
        }
    }

    static createEmptyTaskConf(): ITaskConf {
        return {
            name: '',
            steps: []
        }
    }

    static createEmptyTaskStep() {
        return {
            stepType: StepTypeCode.none,
            remark: '',
            value: ''
        }
    }

    decodeTTConfStr(str: string) {
        let taskConf = LightCodeService.createEmptyTaskConf()
        let taskStep = LightCodeService.createEmptyTaskStep()
        let pt = 0, len = str.length
        let _line = ''
        while (pt < len) {
            switch (str.slice(pt, pt + 2)) {
                // 标题
                case '==':
                    pt += 2
                    while (str[pt] !== '\n' && pt < len) {
                        _line += str[pt]
                        pt++
                    }
                    taskConf.name = _line
                    break
                // 是否运行在新进程中
                case '{}':
                    taskConf.runInNewProcess = true
                    break
                // stepType
                // 结束时必须##结尾
                case '##':
                    pt += 2
                    while (str[pt] !== '\n' && pt < len) {
                        _line += str[pt]
                        pt++
                    }
                    if (taskStep.stepType) {
                        taskConf.steps.push(taskStep)
                    }
                    taskStep = LightCodeService.createEmptyTaskStep()
                    taskStep.stepType = <StepTypeCode>_line.trim()
                    break
                case '++':
                    pt += 2
                    while (str[pt] !== '\n' && pt < len) {
                        _line += str[pt]
                        pt++
                    }
                    if (/\d+/.test(_line)) {
                        let valLen = parseInt(_line)
                        pt = (++pt) + valLen
                        taskStep.value = str.slice(pt - valLen, pt)
                    }
                    break
                case '--':
                    pt += 2
                    while (str[pt] !== '\n' && pt < len) {
                        _line += str[pt]
                        pt++
                    }
                    taskStep.value = _line
                default:
                    break
            }
            _line = ''
            pt++
        }
        return taskConf
    }

    decodeTTFileSync(uri: string) {
        const str = fs.readFileSync(uri, {
            encoding: 'utf8'
        })
        return LightCodeService.INSTANCE.decodeTTConfStr(str)
    }

    encodeTTConfToStr(taskConf: ITaskConf) {
        let str = ''
        if (taskConf.name) {
            str += `==${taskConf.name}`
        }
        for (let step of taskConf.steps) {
            if (!step.stepType) {
                continue
            }
            str += `\n##${step.stepType}`
            if (step.remark) {
                str += `\n//${step.remark}`
            }
            switch (step.stepType) {
                default:
                    if (step.value.includes('\n')) {
                        str += `\n++${step.value.length}\n${step.value}`
                    } else {
                        str += `\n--${step.value}`
                    }
                    break
            }
        }
        str += `\n##`
        return str
    }

    encodeTTFileSync(taskConf: ITaskConf, uri: string) {
        let str = LightCodeService.INSTANCE.encodeTTConfToStr(taskConf)
        fs.writeFileSync(uri, str)
        return str
    }
}

export default LightCodeService


// const testTask: ITaskConf = {
//     name: '项目A',
//     steps: [{
//         stepType: StepTypeCode.cmd,
//         remark: '',
//         value: 'code E:\\gitlab\\client-pdd'
//     }, {
//         stepType: StepTypeCode.cmd,
//         remark: '',
//         value: 'code ./page'
//     }]
// }
// TTCodeService.INSTANCE.encodeTTFileSync(testTask, 'E:\\a.tt')
// TTCodeService.INSTANCE.runTTFile('E:\\a.tt')
