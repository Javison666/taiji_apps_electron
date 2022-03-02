<template>
    <div></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import TaskService from '../services/taskService'

onMounted(() => {
    TaskService.INSTANCE.initialize()
    TaskService.INSTANCE.runTask()
})

</script>