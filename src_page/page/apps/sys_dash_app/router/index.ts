import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'
import localTasks from '../pages/localTasks/index.vue'
import localTasksList from '../pages/localTasks/localTasks.vue'
import specialApps from '../pages/specialApps.vue'
import lightCode from '../pages/localTasks/lightCode/index.vue'

const routes = [
	{
		path: '/',
		component: mainBench,
		children: [{
			path: '/',
			redirect: '/localTasks'
		}, {
			path: '/localTasks',
			component: localTasks,
			children: [{
				path: '/localTasks',
				redirect: '/localTasks/list'
			}, {
				path: '/localTasks/list',
				component: localTasksList
			}, {
				path: '/localTasks/lightCode',
				component: lightCode
			}],
		}, {
			path: '/specialApps',
			component: specialApps
		}, {
			path: '/lightCode',
			component: lightCode
		}]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
