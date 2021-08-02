import { createRouter, createWebHashHistory } from 'vue-router'

import entryViewFileHistory from '../pages/workbench/entryViewFileHistory.vue'
import mainBench from '../pages/workbench/mainBench.vue'

const routes = [
	{ path: '/', component: entryViewFileHistory },
	{ path: '/main', component: mainBench },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
