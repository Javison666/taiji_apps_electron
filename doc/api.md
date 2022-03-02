render process api:

client.ipcRenderer.showErrorBox
client.ipcRenderer.showMessageBox

<!-- 弹窗提示 -->
let res: Boolean = await client.ipcRenderer.invoke(
"client:showHandleWindow",
`确认删除通知渠道(${channelName})吗?`
);

client.ipcRenderer.invoke('client:launchApp', <IAppConfiguraiton>appConf);

<!-- res: AppItemName[] -->
client.ipcRenderer.invoke('client:getBackgroundAppNamesList');

```js
ipcRenderer.send('client:showContextMenu', command, labelList: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]);

ipcRenderer.on(command, (e, label.id) => {
  // ...
})
```
