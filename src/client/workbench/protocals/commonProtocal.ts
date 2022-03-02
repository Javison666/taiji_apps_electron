export enum IAppType {
	Share_Web = 'Share_Web',
	Public_Web = 'Public_Web',
	Client_Web = 'Client_Web'
}

export interface IAppConfiguraiton {
	appId?: number,
	appName: AppItemName,
	appNick?: string,
	categoryType?: AppCategoryType,
	appType: IAppType,
	publicPath?: string,
	querys?: string,
	// 是否正在后台运行
	isBackground?: string,
	// 是否在应用列表中展示
	isHideInList?: boolean,
	browserOpt?: Electron.BrowserWindowConstructorOptions
}

export enum AppItemName {
	Launching_App = 'Launching_App',
	Shared_Process = 'Shared_Process',
	Back_Service = 'Back_Service',
	Sys_Main_App = 'Main_App',
	Sys_Udt_App = 'Sys_Udt_App',
	Sys_Dash_App = 'Sys_Dash_App',
	TTcode_App = 'TTcode_App',
	Hunter_App = 'Hunter_App',
	Notify_App = 'Notify_App',
	Scan_Udt_App = 'Scan_Udt_App',
	Douyin_App = 'Douyin_App',
	Love_String = 'Love_String',
	File_Tool = 'File_Tool',
	Test_Qn = 'Test_Qn',
}

export enum AppCategoryType {
	Third_Fe = 'Third_Fe'
}

// const baseBrowserOpt = {
// 	width: 1024,
// 	height: 720,
// 	webPreferences: {
// 		maximizable: true,
// 		minimizable: true,
// 		fullscreenable: false,
// 	}
// }

// export const LocalAppConfList: IAppConfiguraiton[] = [
// 	{
// 		appName: AppItemName.Test_Qn,
// 		appType: IAppType.Share_Web,
// 		browserOpt: baseBrowserOpt
// 	},
// 	{
// 		appName: AppItemName.File_Tool,
// 		appType: IAppType.Share_Web,
// 		browserOpt: baseBrowserOpt
// 	},

// ]


export enum CommonChannelType {
	_2p_getStaticServerPort = '_2p_getStaticServerPort'
}
