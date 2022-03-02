<template>
  <!-- <div class="relative flex h-full bg-gradient-to-r from-purple-400 via-pink-200 to-green-500">
    <div
      class="absolute z-0 h-full w-full animate-opacity bg-gradient-to-r from-pink-400 via-blue-200 to-purple-500"
  ></div>-->
  <div class="relative flex h-full">
    <div class="flex-col w-24 h-full">
      <div class="j-button-group h-full text-sm">
        <router-link to="/localTasks" class="j-button-group-item">
          本地
        </router-link>
        <!-- <router-link to="/backApps"  class="j-button-group-item">
          广场
        </router-link> -->
        <router-link to="/specialApps"  class="j-button-group-item">
          应用
        </router-link>
      </div>
    </div>
    <div class="relative flex flex-grow h-full">
      <router-view></router-view>
    </div>
    <div class="absolute bottom-1 left-1 text-xs text-white">
      <span>v{{ curVersion }}</span>
      <span
        class="absolute h-3 w-3 -top-1 -right-2.5 cursor-pointer"
        v-if="newVersionInfo && newVersionInfo.newVersionAvailable"
        @click="useLaunchApp(appList.find(i => i.appName === AppItemName.Sys_Udt_App))"
      >
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        ></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import useSystemInfo from 'src_page/page/use/useSystemInfo'
import { getNewVersionInfoBridge } from "src_page/page/bridge/versionUdtBridge";
import { getAppsConfigurationListB } from "src_page/page/bridge/appServiceBridge";
import useAppService from "src_page/page/use/useAppService";
import { AppItemName } from "src/client/workbench/protocals/commonProtocal";

const { curVersion } = useSystemInfo()
const {
  newVersionInfo,
  useLaunchApp,
  appList
} = useAppService();

const loopUdt = async () => {
  try {
    newVersionInfo.value = await getNewVersionInfoBridge()

  } catch (err) {
    console.error(err)
  }
  setTimeout(() => {
    loopUdt()
  }, 1000)
}

export default defineComponent({
  name: "MainBench",
  setup() {
    getAppsConfigurationListB().then((res) => {
      appList.value = res;
    });

    onMounted(async () => {
      curVersion.value = await client.ipcRenderer.invoke('client:getClientVersion')
      loopUdt()
    })

    return {
      useLaunchApp,
      curVersion,
      newVersionInfo,
      appList,
      AppItemName
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>