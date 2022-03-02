export const VersionUdtChannelCommand = {
	mainCommand: 'versionUdt',
	subCommand: {
		getNewVersionInfo: 'getNewVersionInfo',
		startUdtClient: 'startUdtClient'
	}
}

export interface IVersionInfoData {
    addRemarkList: string[],
    improveRemarkList: string[],
    repairRemarkList: string[],
    versionNo: string,
    clientUrl: string,
}

export interface INewVersionInfo {
	newVersionAvailable: boolean,
	newVersionReady: boolean,
	newVersionDetails: IVersionInfoData
}
