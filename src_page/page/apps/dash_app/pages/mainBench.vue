<template>
  <div class="p-6">
    <div class="flex flex-wrap justify-start">
      <div class="p-2 flex w-1/4" v-for="(app) in appList" :key="app.appName">
        <div
          class="
            rounded-full
            h-10
            w-10
            flex
            items-center
            justify-center
            bg-green-400
            cursor-pointer
            m-auto
            mb-0.5
          "
          @click="launchApp(app)"
        >
          <div class="text-white text-center text-xs w-full">
            {{ app.appNick? app.appNick[0] : app.appName[0] }}
          </div>
        </div>
        <div class="text-sm cursor-pointer flex-grow text-left p-1 pt-2" @click="launchApp(app)">
          {{ app.appNick? app.appNick : app.appName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, ref } from "vue";

import useAppService from "src_page/page/use/useAppService";
import { IAppConfiguraiton } from "src/client/workbench/protocals/commonProtocal";
import { getAppsConfigurationListB } from "src_page/page/bridge/appServiceBridge";

export default defineComponent({
  name: "MainBench",
  setup() {
    let { useLaunchApp } = useAppService();
    let appList = ref(<IAppConfiguraiton[]>[]);
    const launchApp = (app: IAppConfiguraiton) => {
      return useLaunchApp(toRaw(app));
    };

    getAppsConfigurationListB().then((res) => {
      appList.value = res;
    });

    return {
      appList,
      launchApp,
    };
  },
});
</script>
