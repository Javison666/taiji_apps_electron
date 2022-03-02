<template>
  <div class="relative h-full bg-gradient-to-r from-purple-400 via-green-200 to-pink-500">
    <div class="j-button" @click="launchDouyin">开启抖音</div>
    <canvas id="canvas" style="opacity: 0" width="552" height="344"></canvas>
  </div>
</template>

<script lang="ts" setup>
import useDouyinApp from '../use/useDouyinApp'

const { launchDouyin } = useDouyinApp()

</script>

<style lang="postcss" scoped>
</style>