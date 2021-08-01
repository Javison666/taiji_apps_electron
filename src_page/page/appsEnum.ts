export interface IAppConfiguraiton {
	app_id?: number,
	app_name: string
}

export enum AppItemName {
	Shared_Process = 'Shared_Process',
	Sprotect = 'Sprotect',
	Mock_Websocket = 'Mock_Websocket',
	Ding_robot = 'Ding_robot',
	Auto_Monitor = 'Auto_Monitor',
	Code_Snippet = 'Code_Snippet'
}
