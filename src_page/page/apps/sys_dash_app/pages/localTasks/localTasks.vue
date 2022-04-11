<template>
  <div class="p-2 pt-0 w-full h-full">
    <div class="mb-1">
      <router-link to="/localTasks/lightCode?status=new">
        <div class="j-button text-xs">
          新增
        </div>
      </router-link>
    </div>
    <div>
      <div
        class="bg-green-700 text-white cursor-pointer flex text-xs p-1.5 mt-0.5"
        v-for="(item, idx) in lightCodeAppList"
        :key="idx"
      >
        <span class="flex-grow text-left">{{ item }}</span>
        <a href="#" class="mr-2" @click.prevent="runLightCodeTaskByName(item)">运行</a>
        <router-link :to="'/localTasks/lightCode?status=edit&name=' + item" class="mr-2">修改</router-link>
        <a href="#" @click.prevent="dellightCode(item)">删除</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useLightCode from "src_page/page/use/useLightCode";

export default defineComponent({
  name: "localTask",
  setup() {
    const {
      lightCodeAppList,
      initLightCodeList,
      runLightCodeTaskByName,
      delLightCodeTaskByName
    } = useLightCode();

    const dellightCode = async (name: string) => {
      await delLightCodeTaskByName(name)
      initLightCodeList()
    }

    initLightCodeList();

    return {
      lightCodeAppList,
      initLightCodeList,
      runLightCodeTaskByName,
      dellightCode
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>