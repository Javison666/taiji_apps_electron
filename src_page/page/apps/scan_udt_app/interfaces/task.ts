
export type ITaskName = string

export enum TaskStatus {
    Free = 0,
    NotFree = 1
}

export interface TaskItem {
    taskName: string,
    taskURI: string,
    taskInterval: string,
    taskStatus?: TaskStatus,
    taskLastTime?: string | number,
    versionLastMd5?: string,
    versionLastTime?: string | number,
    channelNames: string[],
    taskRepScript: string
}

export interface VersionItem {
    taskName: string,
    fileName?: string,
    versionTime: string | number,
    versionTimeVal: string,
    versionMd5?: string
}

export interface TaskDingItem {
    taskName: string,
    dingName: string
}