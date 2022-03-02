import { toRaw, ref } from 'vue'
import { launchAppB } from '../bridge/appServiceBridge'
import { AppItemName, IAppConfiguraiton } from "src/client/workbench/protocals/commonProtocal";
import { INewVersionInfo } from 'src/client/workbench/protocals/versionUdtServiceProtocal'

export default () => {

	const appList = ref(<IAppConfiguraiton[]>[]);

	const backgroundAppNames = ref(<AppItemName[]>[])

	const newVersionInfo = ref(<INewVersionInfo>{})

	const useLaunchApp = async (appConf?: IAppConfiguraiton) => {
		if(appConf){
			launchAppB(toRaw(appConf))
		}
	}

	client.ipcRenderer.on('render:contextAppName', (e: any, appName: string, command: string) => {
		switch(command){
			case 'addBackground':
				client.ipcRenderer.invoke('client:addBackground', appName);
				break;
			case 'removeBackground':
				client.ipcRenderer.invoke('client:removeBackground', appName);
				break;
			default:
				break;
		}
	})

	const useShowAppContextMenu = (appName: AppItemName) => {
		const labelList: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [{
			label: backgroundAppNames.value.includes(appName) ? '取消常驻' : '应用常驻',
			id: backgroundAppNames.value.includes(appName) ? 'removeBackground' : 'addBackground'
		}]
		client.ipcRenderer.send('client:showAppNameContextMenu', appName, 'render:contextAppName', labelList);
	}

	return {
		appList,
		backgroundAppNames,
		useLaunchApp,
		useShowAppContextMenu,
		newVersionInfo
	}
}
