export enum IAppType {
	Share_Web = 'Share_Web',
	Client_Web = 'Client_Web'
}

export interface IAppConfiguraiton {
	appId?: number,
	appName: string,
	startWidth: number,
	startHeight: number,
	appType: IAppType
}

export enum AppItemName {
	Dash_App = 'Dash_App',
	Shared_Process = 'Shared_Process',
	Sprotect = 'Sprotect',
	Mock_Websocket = 'Mock_Websocket',
	Ding_robot = 'Ding_robot',
	Auto_Monitor = 'Auto_Monitor',
	Code_Snippet = 'Code_Snippet',
	Encrypt_Decode = 'Encrypt_Decode'
}
