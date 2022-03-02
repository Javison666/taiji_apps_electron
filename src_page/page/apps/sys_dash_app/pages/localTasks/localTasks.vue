<template>
  <div class="p-2 pt-0 w-full h-full">
    <div class="mb-1">
      <router-link to="/localTasks/lowcode?status=new">
        <div class="j-button text-xs" @click="addLowcodeStep(idx)">
          新增
        </div>
      </router-link>
    </div>
    <div>
      <div
        class="bg-green-700 text-white cursor-pointer flex text-xs p-2"
        v-for="(item, idx) in ttcodeAppList"
        :key="idx"
      >
        <span class="flex-grow text-left">{{ item }}</span>
        <a href="#" class="mr-2" @click.prevent="runTTcodeTaskByName(item)">运行</a>
        <router-link :to="'/localTasks/lowcode?status=edit&name=' + item">修改</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useLowcode from "src_page/page/use/useLowcode";

export default defineComponent({
  name: "localTask",
  setup() {
    const { initTTcodeList, ttcodeAppList, runTTcodeTaskByName } = useLowcode();
    // code E:\reverse-gitlab\qn-remote-js-new-version\qn-remote-js
    // const openVscode = () => {
    //   client.ipcRenderer.invoke('client:runTTcodeTask', {
    //     name: 'test',
    //     steps: [{
    //       stepType: 'cmd',
    //       value: `code E:\\reverse-gitlab\\qn-remote-js-new-version\\qn-remote-js`
    //     }]
    //   })
    // };

    initTTcodeList();

    return {
      ttcodeAppList,
      initTTcodeList,
      runTTcodeTaskByName,
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>