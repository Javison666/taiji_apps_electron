<template>
  <div class="relative flex flex-grow h-full">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainBench",
  setup() {
  },
});
</script>

<style lang="postcss" scoped>
</style>