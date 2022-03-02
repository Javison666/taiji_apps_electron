<template>
  <div class="flex flex-col h-full bg-gray-100">
    <div class="flex w-full">
      <div class="j-button-group w-full">
        <router-link to="/addEditChannel">
          <div class="j-button-group-item w-full">添加</div></router-link
        >
      </div>
    </div>
    <div class="p-6 justify-start text-left">
      <div v-if="channelList.length === 0">暂无通知渠道，请前往添加。</div>
      <div class="j-card mb-3" v-for="item in channelList" :key="item[0]">
        <div>
          <span>{{ item[0] }}</span>
          <a class="float-right cursor-pointer text-red-500" @click.prevent="toDel(item[0])"
            >删除</a
          >
          <a
            class="float-right cursor-pointer mr-2"
            @click.prevent="toEdit(item[0])"
            >编辑</a
          >
        </div>
        <div>
          【{{ item[1].channelType }}】
          <span v-if="item[1].channelType === INotifyChannelType.ding"
            >关键字: {{ item[1].channelJson.tagValue }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NotifyService, {
  INotifyChannelName,
  INotifyChannelMapItem,
  INotifyChannelType,
} from "src_page/page/services/notifyService";

export default defineComponent({
  name: "MainBench",
  setup() {
    const router = useRouter();

    const channelList = ref(<[INotifyChannelName, INotifyChannelMapItem][]>[]);

    const toEdit = (channelName: INotifyChannelName) => {
      router.push(`/addEditChannel?channelName=${channelName}`);
    };

    const udtChannelList = () => {
      let _channelList = NotifyService.INSTANCE.getNotifyChannelList();
      channelList.value = _channelList.sort(
        (a, b) => b[1].udtTime - a[1].udtTime
      );
    };

    const toDel = async (channelName: INotifyChannelName) => {
      const res = await client.ipcRenderer.invoke(
        "client:showHandleWindow",
        `确认删除通知渠道(${channelName})吗?`
      );
      if (res) {
        await NotifyService.INSTANCE.delNotifyChannelItem(channelName);
        udtChannelList();
      }
    };

    onMounted(async () => {
      udtChannelList();
    });

    return {
      channelList,
      toEdit,
      toDel,
      INotifyChannelType,
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>