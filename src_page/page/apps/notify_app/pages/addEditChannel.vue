<template>
  <div class="m-auto p-4">
    <div class="w-full">
      <div class="w-24 text-left">
        <router-link to="/" tag="div" class="j-button">&lt; 返回</router-link>
      </div>
    </div>
    <table class="table-fixed w-full j-table mt-2">
      <thead>
        <tr>
          <th class="w-48">类目</th>
          <th class="w-48">填写</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>*通知渠道名称</td>
          <td class="p-1 px-2">
            <input
              v-model="channelName"
              type="text"
              :readonly="!isCreateState"
              class="form-input rounded py-0.5 w-full"
              :class="{ 'cursor-not-allowed': !isCreateState }"
            />
          </td>
        </tr>
        <tr class="bg-emerald-200">
          <td>*通知渠道类型</td>
          <td class="text-left p-1 px-2">
            <select
              v-model="channelType"
              class="form-select px-8 py-0.5 w-full"
            >
              <option :value="INotifyChannelType.ding">钉钉</option>
              <option :value="INotifyChannelType.mail">邮箱</option>
            </select>
          </td>
        </tr>
        <tr v-show="channelType === INotifyChannelType.ding">
          <td>*Webhook</td>
          <td class="p-1 px-2">
            <input
              v-model="Webhook"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
          </td>
        </tr>
        <tr v-show="channelType === INotifyChannelType.ding">
          <td>*关键字</td>
          <td class="p-1 px-2">
            <input
              v-model="tagValue"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
          </td>
        </tr>
        <tr v-show="channelType === INotifyChannelType.mail">
          <td>*Mail</td>
          <td class="p-1 px-2">
            <input
              v-model="Webhook"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-2">
      <div class="j-button w-24 m-auto" @click="confirm">
        确定
        <span v-if="isCreateState">添加</span>
        <span v-else>修改</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import NotifyService, {
  INotifyChannelType,
  INotifyChannelMapItem,
} from "src_page/page/services/notifyService";

// https://oapi.dingtalk.com/robot/send?access_token=c4b328c9ba0a90af097bf17a7e294391591c3d967a1b54dbcd4369c7255e38f9
// 通知

export default defineComponent({
  name: "MainBench",
  setup() {
    const router = useRouter();

    let channelName = ref("");
    let channelType = ref(<INotifyChannelType>INotifyChannelType.ding);
    let Webhook = ref("");
    let tagValue = ref("");
    let isCreateState = true;

    const route = useRoute();
    if (route.query.channelName) {
      isCreateState = false;
      channelName.value = String(route.query.channelName);

      // 载入旧有数据
      const channelItem = NotifyService.INSTANCE.getNotifyChannelByName(
        channelName.value
      );
      if (channelItem) {
        channelType.value = channelItem?.channelType;
        switch (channelType.value) {
          case INotifyChannelType.ding:
            const channelJson = channelItem.channelJson;
            channelJson.Webhook && (Webhook.value = channelJson.Webhook)
            channelJson.tagValue && (tagValue.value = channelJson.tagValue)
            break;
          default:
            break;
        }
      }
    }

    // 提交按钮
    const confirm = async () => {
      if (!channelName.value) {
        client.ipcRenderer.showErrorBox(
          "操作通知渠道错误",
          "请输入正确的渠道名称"
        );
        return;
      }

      if (
        isCreateState &&
        (await NotifyService.INSTANCE.isNotifyChannelNameExisted(
          channelName.value
        ))
      ) {
        client.ipcRenderer.showErrorBox("操作通知渠道错误", "渠道名称已存在");
        return;
      }

      //  暂不支持除钉钉其他方式
      if (channelType.value !== INotifyChannelType.ding) {
        client.ipcRenderer.showErrorBox(
          "操作通知渠道错误",
          "暂不支持除钉钉其他方式"
        );
        return;
      }

      // 钉钉如下
      if (!Webhook.value) {
        client.ipcRenderer.showErrorBox(
          "操作通知渠道错误",
          "请输入正确的Webhook"
        );
        return;
      }
      if (!tagValue.value) {
        client.ipcRenderer.showErrorBox(
          "操作通知渠道错误",
          "请输入正确的tagValue"
        );
        return;
      }

      const channelItem: INotifyChannelMapItem = {
        channelType: channelType.value,
        channelJson: {
          Webhook: Webhook.value,
          tagValue: tagValue.value,
        },
		udtTime: Date.now()
      };
      await NotifyService.INSTANCE.setNotifyChannelItem(
        channelName.value,
        channelItem
      );

      router.push({
        path: "/",
      });
    };

    return {
      channelName,
      channelType,
      Webhook,
      tagValue,
      confirm,
      isCreateState,
      INotifyChannelType,
    };
  },
});
</script>
