<template>
  <div class="p-2 pt-0 w-full h-full">
    <div class="mb-1">
      <router-link to="/localTasks/lowcode?status=new">
        <div class="j-button text-xs">
          新增
        </div>
      </router-link>
    </div>
    <div>
      <div
        class="bg-green-700 text-white cursor-pointer flex text-xs p-1.5 mt-0.5"
        v-for="(item, idx) in ttcodeAppList"
        :key="idx"
      >
        <span class="flex-grow text-left">{{ item }}</span>
        <a href="#" class="mr-2" @click.prevent="runTTcodeTaskByName(item)">运行</a>
        <router-link :to="'/localTasks/lowcode?status=edit&name=' + item" class="mr-2">修改</router-link>
        <a href="#" @click.prevent="delTTcode(item)">删除</a>
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
    const {
      initTTcodeList,
      ttcodeAppList,
      runTTcodeTaskByName,
      delTTcodeTaskByName
    } = useLowcode();

    const delTTcode = async (name: string) => {
      await delTTcodeTaskByName(name)
      initTTcodeList()
    }

    initTTcodeList();

    return {
      ttcodeAppList,
      initTTcodeList,
      runTTcodeTaskByName,
      delTTcode
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>