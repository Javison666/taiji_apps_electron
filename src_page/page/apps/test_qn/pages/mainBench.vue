<template>
  <div class="absolute w-full h-full flex">
    <div class="bg-gray-900 flex-grow text-xs text-left flex flex-col">
      <div class="flex-1 flex flex-col h-2/4">
        <div
          class="bg-blue-800 flex text-gray-300 pl-1"
          style="height: 20px; line-height: 20px"
        >
          qninside_client &lt;=&gt; qncdp_server [{{ insideClientSize }}个]
        </div>
        <div ref="a_log_box" class="p-1 flex-grow overflow-auto">
          <div
            v-for="(item, idx) in a_logList"
            :key="idx"
            :class="item.type === 'send' ? 'text-gray-400' : 'text-green-500'"
          >
            [{{ new Date(item.time).toLocaleString() }}] [id:{{
              item.clientId
            }}] {{ item.type === "recv" ? "from inside" : "to inside" }}:
            {{ item.message }}
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col h-2/4">
        <div
          class="bg-blue-800 flex text-gray-300 pl-1"
          style="height: 20px; line-height: 20px"
        >
          qncef_client &lt;=&gt; qninside_server [{{ cefClientSize }}个]
        </div>
        <div ref="b_log_box" class="p-1 flex-grow overflow-auto">
          <div
            v-for="(item, idx) in b_logList"
            :key="idx"
            :class="item.type === 'send' ? 'text-gray-400' : 'text-green-500'"
          >
            [{{ new Date(item.time).toLocaleString() }}] [id:{{
              item.clientId
            }}] {{ item.type === "recv" ? "from inside" : "to inside" }}:
            {{ item.message }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col" style="width: 200px">
      <div class="p-1 flex-grow">
        <span class="text-base font-extrabold p-1">千牛小微测试工具</span>
        <div>
          <span class="text-xs font-light p-1"
            >ws://127.0.0.1:{{ wsServerPort }}
          </span>
        </div>
        <div class="text-xs font-light p-1">/test [{{ testClientSize }}个]</div>
      </div>
      <div>
          <div
            @click="switchSyncBottom"
            class="cursor-pointer text-white"
            :class="isSyncBottom ? 'bg-red-500' : 'bg-green-500'"
          >
            {{ isSyncBottom ? "关闭日志底部同步" : "开启日志底部同步" }}
          </div>
        </div>
    </div>

    <!-- <div class="flex flex-wrap justify-start">
      <div></div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import UseClientManage from "src_page/page/apps/test_qn/use/useClientManage";

export default defineComponent({
  name: "MainBench",
  setup() {

    const useClientManage = UseClientManage();
    const a_log_box = ref(<HTMLDivElement | null>null);
    const b_log_box = ref(<HTMLDivElement | null>null);

    const loopUdtClientManage = () => {
      setTimeout(() => {
        useClientManage.udtInsideClientSize();
        useClientManage.udtTestClientSize();
        useClientManage.udtCefClientSize();
        loopUdtClientManage();
      }, 333);
    };

    onMounted(() => {
      loopUdtClientManage();

      useClientManage.registerAScrollToBottom(() => {
        nextTick(() => {
          a_log_box.value &&
            (a_log_box.value.scrollTop = a_log_box.value.scrollHeight);
        });
      });

      useClientManage.registerBScrollToBottom(() => {
        nextTick(() => {
          b_log_box.value &&
            (b_log_box.value.scrollTop = b_log_box.value.scrollHeight);
        });
      });
    });

    return {
      ...useClientManage,
      a_log_box,
      b_log_box,
    };
  },
});
</script>
