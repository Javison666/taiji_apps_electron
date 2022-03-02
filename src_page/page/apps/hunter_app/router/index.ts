import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'
import shareTable from '../pages/shareTable.vue'

const routes = [
	{
		path: '/',
		component: mainBench,
		children: [{
			path: '/',
			redirect: '/shareTable'
		}, {
			path: '/shareTable',
			component: shareTable
		}]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
