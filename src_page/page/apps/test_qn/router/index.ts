import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'

const routes = [
	{ path: '/', component: mainBench },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
