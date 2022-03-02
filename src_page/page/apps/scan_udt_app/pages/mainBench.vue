<template>
  <div class="flex flex-col h-full bg-gray-100">
    <div class="flex w-full">
      <div class="j-button-group w-full">
        <router-link to="/addEditItem">
          <div class="j-button-group-item w-full">添加</div></router-link
        >
      </div>
    </div>
    <div class="p-6 justify-start text-left">
      <div v-if="itemList.length === 0">暂无任务，请前往添加。</div>
      <div class="j-card mb-3" v-for="item in itemList" :key="item.taskName">
        <div>
          <span>任务: {{ item.taskName }}</span>
          <a
            class="float-right cursor-pointer text-red-500"
            @click.prevent="toDel(item.taskName)"
            >删除</a
          >
          <a
            class="float-right cursor-pointer mr-2"
            @click.prevent="toEdit(item.taskName)"
            >编辑</a
          >
        </div>
        <div>
          <div>地址: {{ item.taskURI }}</div>
          <div>间隔: {{ item.taskInterval }} sec</div>
          <div>通知: {{ item.channelNames.join(",") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRaw, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import LowdbService from "../services/lowdbService";
import { ITaskName, TaskItem } from "../interfaces/task";

export default defineComponent({
  name: "MainBench",
  setup() {
    const router = useRouter();

    const itemList = ref(<TaskItem[]>[]);

    const toEdit = (itemName: ITaskName) => {
      router.push(`/addEditItem?itemName=${itemName}`);
    };

    const udtItemList = () => {
      let _itemList = LowdbService.INSTANCE.taskListDbFask();
      itemList.value = _itemList.map((i) => i);
    };

    const toDel = async (itemName: ITaskName) => {
      const res = await client.ipcRenderer.invoke(
        "client:showHandleWindow",
        `确认删除任务(${itemName})吗?`
      );

      if (res) {
        LowdbService.INSTANCE.taskDelDb(itemName);
        udtItemList();
      }
    };

    onMounted(async () => {
      udtItemList();
    });

    return {
      itemList,
      toEdit,
      toDel,
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>