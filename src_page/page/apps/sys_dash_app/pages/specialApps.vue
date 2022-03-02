<template>
  
  <div>
    <div class="z-1 p-6 flex flex-wrap justify-start">
      <div class="m-2" v-for="app in appList.filter(i => !(i.isHideInList))" :key="app.appName">
        <div
          class="rounded-lg h-8 w-24 flex items-center justify-center bg-green-400 cursor-pointer mb-0.5 relative overflow-hidden"
          @click="useLaunchApp(app)"
          @contextmenu="useShowAppContextMenu(app.appName)"
        >
          <div
            v-if="backgroundAppNames.includes(app.appName)"
            class="absolute bg-green-600 animate-pulse h-1 w-full bottom-0"
          ></div>
          <div class="text-white text-center tracking-widest w-full">
            {{ app.appNick ? app.appNick.substr(0) : app.appName }}
            <!-- {{ app.appNick ? app.appNick.substr(0,2) : app.appName }} -->
          </div>
        </div>
        <!-- <div class="text-sm cursor-pointer" @click="launchApp(app)">
          {{ app.appNick ? app.appNick : app.appName }}
        </div>-->
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

import useAppService from "src_page/page/use/useAppService";

import { getAppsConfigurationListB } from "src_page/page/bridge/appServiceBridge";


const {
  useLaunchApp,
  useShowAppContextMenu,
  appList,
  backgroundAppNames,
  newVersionInfo,
} = useAppService();


const loopUdt = async () => {
  // getNewVersionInfo
  backgroundAppNames.value = await client.ipcRenderer.invoke('client:getBackgroundAppNamesList');
  setTimeout(() => {
    loopUdt()
  }, 1000)
}

// onMounted(async () => {
//   getAppsConfigurationListB().then((res) => {
//     appList.value = res;
//   });
//   loopUdtBackgroundAppNames()
// })

export default defineComponent({
  name: "SpecialApps",
  setup() {


    getAppsConfigurationListB().then((res) => {
      appList.value = res;
    });

    onMounted(async () => {
      try {
      } catch (err) {
        console.error(err)
      }

      loopUdt()
    })

    return {
      appList,
      backgroundAppNames,
      newVersionInfo,
      useLaunchApp,
      useShowAppContextMenu
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>