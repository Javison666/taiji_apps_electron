import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'
import localTasks from '../pages/localTasks/index.vue'
import localTasksList from '../pages/localTasks/localTasks.vue'
import specialApps from '../pages/specialApps.vue'
import lowcode from '../pages/localTasks/lowcode/index.vue'

const routes = [
	{
		path: '/',
		component: mainBench,
		children: [{
			path: '/',
			redirect: '/localTasks'
		},{
			path: '/localTasks',
			component: localTasks,
			children: [{
				path: '/localTasks',
				redirect: '/localTasks/list'
			}, {
				path: '/localTasks/list',
				component: localTasksList
			}, {
				path: '/localTasks/lowcode',
				component: lowcode
			}],
		},{
			path: '/specialApps',
			component: specialApps
		},{
			path: '/lowcode',
			component: lowcode
		}]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
