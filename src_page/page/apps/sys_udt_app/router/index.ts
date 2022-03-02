import { createRouter, createWebHashHistory } from 'vue-router'

// import mainBench from '../pages/workbench/mainBench.vue'
import udtProccess from '../pages/udtProcess.vue'

const routes = [
	{ path: '/', component: udtProccess },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
