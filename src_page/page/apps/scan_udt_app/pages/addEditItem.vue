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
          <td>*任务名称</td>
          <td class="p-1 px-2">
            <input
              v-model="taskName"
              type="text"
              :readonly="!isCreateState"
              class="form-input rounded py-0.5 w-full"
              :class="{ 'cursor-not-allowed': !isCreateState }"
            />
          </td>
        </tr>
        <tr>
          <td>*扫描链接</td>
          <td class="p-1 px-2">
            <input
              v-model="taskURI"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
          </td>
        </tr>
        <tr>
          <td>*Response Script</td>
          <td class="p-1 px-2">
            <textarea
              v-model="taskRepScript"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
            <a href="#" @click.prevent="showTestResult">测试</a>
            <div>备注：($, md5) => { return *** }</div>
          </td>
        </tr>
        <tr>
          <td>*轮询时长</td>
          <td class="p-1 px-2">
            <input
              v-model="taskInterval"
              type="text"
              class="form-input rounded py-0.5 w-full"
            />
          </td>
        </tr>
        <tr>
          <td>*通知渠道</td>
          <td class="p-1 px-2">
            <!-- <input
              v-model="channelNames"
              type="text"
              class="form-input rounded py-0.5 w-full"
            /> -->
            <select
              v-model="channelNames"
              :multiple="true"
              class="px-8 py-0.5 w-full"
            >
              <option v-for="item in channelAllNames" :key="item" :value="item">{{ item }}</option>
            </select>
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
import { defineComponent, onMounted, ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import LowdbService from "../services/lowdbService";
import TaskService from "../services/taskService";
import { ITaskName } from '../interfaces/task'
import NotifyService from "src_page/page/services/notifyService";

// https://oapi.dingtalk.com/robot/send?access_token=c4b328c9ba0a90af097bf17a7e294391591c3d967a1b54dbcd4369c7255e38f9
// 通知

export default defineComponent({
  name: "MainBench",
  setup() {
    const router = useRouter();

    let taskName = ref("");
    let taskURI = ref("");
    let taskRepScript = ref("");
    let taskInterval = ref("");
    let channelAllNames = ref(<ITaskName[]>[]);
    let channelNames = ref(<ITaskName[]>[]);
    let isCreateState = true;

    onMounted(() => {
      let _channelAllNames = NotifyService.INSTANCE.getNotifyChannelList();
      channelAllNames.value = _channelAllNames.sort(
        (a, b) => b[1].udtTime - a[1].udtTime
      ).map(i=>i[0])
    })

    const getItemData = () => {
      return {
        taskName: taskName.value,
        taskURI: taskURI.value,
        taskRepScript: taskRepScript.value,
        taskInterval: taskInterval.value,
        channelNames: toRaw(channelNames.value),
      }
    }

    const route = useRoute();
    if (route.query.itemName) {
      isCreateState = false;
      taskName.value = String(route.query.itemName);

      // 载入旧有数据
      const item = LowdbService.INSTANCE.taskGetByNameDbFast(
        taskName.value
      );
      if (item) {
        taskURI.value = item.taskURI
        taskInterval.value = item.taskInterval
        channelNames.value = item.channelNames
        taskRepScript.value = item.taskRepScript
      }
    }

    const showTestResult = async () => {
      let res = await TaskService.INSTANCE.testTaskRepScript(getItemData());
      client.ipcRenderer.showMessageBox({
        title: '操作扫描脚本执行结果',
        type: 'info',
        message: res
      })
    }

    // 提交按钮
    const confirm = async () => {
      console.log(channelNames)
      if (!taskName.value) {
        client.ipcRenderer.showErrorBox(
          "操作扫描变更错误",
          "请输入正确的任务名称"
        );
        return;
      }

      if (
        isCreateState &&
        (await LowdbService.INSTANCE.isTaskExisted(
          taskName.value
        ))
      ) {
        client.ipcRenderer.showErrorBox("操作通知渠道错误", "渠道名称已存在");
        return;
      }

      if (!/^(?:(?:https?|ftp):\/\/)?(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/.test(
          taskURI.value
        )) {
        client.ipcRenderer.showErrorBox(
          "操作扫描变更错误",
          "请输入正确的扫描链接"
        );
        return;
      }

      if (!/^([1-9]\d*|[0]{1,1})$/.test(taskInterval.value)) {
        client.ipcRenderer.showErrorBox(
          "操作扫描变更错误",
          "请输入正确的间隔时长"
        );
        return;
      }

      if (!channelNames.value.length) {
        client.ipcRenderer.showErrorBox("操作扫描变更错误", "请选择通知渠道");
        return;
      }

      LowdbService.INSTANCE.taskUdtDb({
        taskName: taskName.value,
        taskURI: taskURI.value,
        taskRepScript: taskRepScript.value,
        taskInterval: taskInterval.value,
        channelNames: toRaw(channelNames.value),
      })

      router.push({
        path: "/",
      });
    };

    return {
      taskName,
      taskURI,
      taskRepScript,
      taskInterval,
      channelNames,
      channelAllNames,
      showTestResult,
      confirm,
      isCreateState,
    };
  },
});
</script>
