type ILowcodeAppName = string

export enum StepTypeCode {
    none = '',
    cmd = 'cmd',
    bash = 'bash'
}

export interface ILowcodeStepItem {
    stepType: StepTypeCode,
    remark: string,
    value: string
}

export interface ILowcodeApp {
    name: ILowcodeAppName,
    steps: ILowcodeStepItem[]
}