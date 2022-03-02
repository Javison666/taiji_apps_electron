<template>
  <div class="p-2 w-full h-full overflow-scroll text-left">
    <div class="flex">
      <router-link to="/localTasks/list" class="text-xs" replace>&lt;&lt;返回</router-link>
      <span class="flex-grow text-center">{{
        isNewPage ? "新增" : "修改"
      }}</span>
      <a href="#" class="text-xs" @click.prevent="">清空</a>
    </div>
    <div class="mb-2 flex text-xs">
      <div>
        应用名：<input class="border-2" v-model="lowcodeApp.name" />
      </div>
      <!-- <div>
        分组：<input class="border-2" :value="lowcodeApp.name" />
      </div> -->
    </div>
    <div>
      <div class="mb-2" v-for="(step, idx) in lowcodeApp.steps" :key="idx">
        <div class="j-button text-xs mb-1" @click="addLowcodeStep(idx)">
          添加步骤
        </div>
        <div class="border-2 border-b-0 text-sm pl-1">
          <span class="font-bold mr-4">步骤{{ idx + 1 }}</span>
          <span class="text-xs">备注:</span>
          <input class="text-xs" v-model="step.remark" />
        </div>
        <div class="tag-group border-2 border-b-2 text-xs flex flex-wrap">
          <div
            v-for="typename in StepTypeCode"
            :key="typename"
            :class="{ 'text-green-600': step.stepType === typename }"
            @click="step.stepType = typename"
            class="pr-1 cursor-pointer hover:text-green-500"
          >
            {{ typename }}
          </div>
        </div>
        <div class="border-2 border-t-0">
          <textarea
            v-model="step.value"
            class="w-full block p-1 p-b-0 border-0 text-xs"
            rows="2"
          ></textarea>
        </div>
        <div class="text-right">
          <div
            class="j-button-error text-xs inline-block"
            @click="delLowcodeStep(idx)"
          >
            删除步骤
          </div>
        </div>
      </div>
      <div class="j-button text-xs mb-1" @click="addLowcodeStep(lowcodeApp.steps.length)">
        添加步骤
      </div>
      <div class="j-button text-sm mt-4 text-center" @click="saveLowcodeApp">
        保存
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useLowcode from "src_page/page/use/useLowcode";
import { StepTypeCode } from "src_page/page/types/defineLowcode";

export default defineComponent({
  name: "lowcode",
  setup() {
    const {
      initLowcodeApp,
      isNewPage,
      lowcodeApp,
      addLowcodeStep,
      delLowcodeStep,
      saveLowcodeApp,
      clearLowcodeApp,
    } = useLowcode();
    initLowcodeApp();
    return {
      isNewPage,
      lowcodeApp,
      StepTypeCode,
      addLowcodeStep,
      delLowcodeStep,
      clearLowcodeApp,
      saveLowcodeApp,
    };
  },
});
</script>

<style lang="postcss" scoped>
</style>