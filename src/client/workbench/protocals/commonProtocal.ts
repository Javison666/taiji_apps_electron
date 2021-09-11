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
	querys?: string
	browserOpt?: {
		width: number,
		height: number,
		webPreferences: {
			maximizable?: boolean,
			minimizable?: boolean,
			fullscreenable?: boolean,
			closable?: boolean
		}
	}
}

export enum AppItemName {
	Dash_App = 'Dash_App',
	Shared_Process = 'Shared_Process',
	Back_Service = 'Back_Service',
	Love_String = 'Love_String',
	File_Tool = 'File_Tool',
	Fe_json_format = 'Fe_json_format',
	Fe_regexp = 'Fe_regexp',
	Fe_code_beautify = 'Fe_code_beautify',
	Fe_code_compress = 'Fe_code_compress',
	Fe_en_decode = 'Fe_en_decode',
	Fe_html2markdown = 'Fe_html2markdown',
	Fe_image_base64 = 'Fe_image_base64',
	Fe_json_diff = 'Fe_json_diff',
	Fe_password = 'Fe_password',
	Fe_qr_code = 'Fe_qr_code',
	Fe_timestamp = 'Fe_timestamp',
	Fe_toolkit = 'Fe_toolkit'
}

export enum AppCategoryType {
	Third_Fe = 'Third_Fe'
}

const baseBrowserOpt = {
	width: 1024,
	height: 720,
	webPreferences: {
		maximizable: true,
		minimizable: true,
		fullscreenable: false,
	}
}

export const LocalAppConfList: IAppConfiguraiton[] = [
	// {
	// 	appName: AppItemName.Test_Qn,
	// 	startWidth: 1024,
	// 	startHeight: 720,
	// 	appType: IAppType.Share_Web,
	// 	browserOpt: {
	// 		maximizable: true,
	// 		minimizable: true,
	// 		fullscreenable: false,
	// 	}
	// },
	{
		appName: AppItemName.File_Tool,
		appType: IAppType.Share_Web,
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_json_format,
		appNick: 'JSON格式化查看',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/json-format',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_regexp,
		appNick: '正则表达式工具',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/regexp',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_code_beautify,
		appNick: '代码美化',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/code-beautify',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_code_compress,
		appNick: 'Javascript代码压缩',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/code-compress',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_en_decode,
		appNick: '字符串编解码',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/en-decode',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_html2markdown,
		appNick: 'HTML转Markdown',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/html2markdown',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_image_base64,
		appNick: '图片转Base64',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/image-base64',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_json_diff,
		appNick: 'JSON比对工具',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/json-diff',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_password,
		appNick: '随机密码生成器',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/password',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_qr_code,
		appNick: '二维码生成器',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/qr-code',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_timestamp,
		appNick: '时间戳转换工具',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/timestamp',
		browserOpt: baseBrowserOpt
	},
	{
		appName: AppItemName.Fe_toolkit,
		appNick: '多维小工具集',
		categoryType: AppCategoryType.Third_Fe,
		appType: IAppType.Public_Web,
		publicPath: '/FeHelper/toolkit',
		browserOpt: baseBrowserOpt
	},
]


export enum CommonChannelType {
	_2p_getStaticServerPort = '_2p_getStaticServerPort'
}
